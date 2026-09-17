import { Buffer } from "node:buffer";
import tls from "node:tls";

/**
 * A minimal SMTP client: TLS from the first byte (port 465), AUTH PLAIN, one message, one recipient.
 *
 * It is written against `node:tls` instead of using nodemailer because the site runs on Cloudflare
 * Workers, which implement `tls.connect` under `nodejs_compat` but not the other Node APIs
 * nodemailer relies on. The same code runs under Node during `npm run dev`.
 *
 * The `.server.ts` suffix matters: TanStack Start's import protection refuses to ship `*.server.*`
 * files to the browser, so the login code can never end up in the client bundle.
 */

export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  /** Milliseconds allowed for the whole exchange. */
  timeoutMs?: number;
};

export type MailAddress = { name?: string; address: string };

export type MailMessage = {
  from: MailAddress;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
};

/** The server answered with a code that means the message was not accepted. */
export class SmtpError extends Error {
  readonly code: number;
  constructor(code: number, message: string) {
    super(message);
    this.name = "SmtpError";
    this.code = code;
  }
}

/** The part of a socket this client uses. Tests pass a plain TCP socket to a local fake server. */
export interface SmtpSocket {
  write(data: string): unknown;
  on(event: "data" | "error" | "close", listener: (value?: unknown) => void): unknown;
  destroy(): unknown;
}
export type SmtpConnect = (host: string, port: number) => SmtpSocket;

const connectTls: SmtpConnect = (host, port) => tls.connect({ host, port, servername: host });

const encoder = new TextEncoder();

/** Printable ASCII only, one `@`, and none of the characters that could break out of `<...>`. */
function checkAddress(address: string) {
  if (!/^[^@\s<>",;]+@[^@\s<>",;]+$/.test(address) || !/^[\x21-\x7e]+$/.test(address))
    throw new Error("Refusing to use an invalid email address.");
  return address;
}

/**
 * RFC 2047 encoded-words. Each word holds at most 39 bytes (52 base64 characters, 64 with the
 * wrapper), so even the first word, which shares a line with "Subject: ", stays within 78
 * characters. A character is never split across words.
 */
function encodeWords(value: string) {
  const words: string[] = [];
  let word = "";
  for (const character of value) {
    if (word && encoder.encode(word + character).length > 39) {
      words.push(word);
      word = "";
    }
    word += character;
  }
  if (word) words.push(word);
  return words
    .map((part) => `=?UTF-8?B?${Buffer.from(part, "utf8").toString("base64")}?=`)
    .join("\r\n ");
}

function headerText(value: string) {
  // Line breaks can never reach a header, whatever the caller validated.
  const flat = value.replace(/[\r\n]+/g, " ");
  return /^[\x20-\x7e]{0,60}$/.test(flat) ? flat : encodeWords(flat);
}

function formatAddress({ name, address }: MailAddress) {
  const mailbox = `<${checkAddress(address)}>`;
  if (!name) return mailbox;
  return `${/^[A-Za-z0-9 .'-]+$/.test(name) ? `"${name}"` : encodeWords(name)} ${mailbox}`;
}

/** Base64 of the UTF-8 bytes, in 76-character lines. Line endings are made CRLF first. */
function base64Body(value: string) {
  const canonical = value.replace(/\r?\n/g, "\r\n");
  const encoded = Buffer.from(canonical, "utf8").toString("base64");
  return (encoded.match(/.{1,76}/g) ?? []).join("\r\n");
}

/** Builds the raw message: ASCII only, CRLF line endings, no line over 78 characters. */
export function buildMimeMessage(message: MailMessage, date: Date, id: string) {
  const domain = message.from.address.split("@")[1] ?? "localhost";
  const boundary = `----=_netswagger_${id}`;
  const part = (type: string, body: string) =>
    [
      `--${boundary}`,
      `Content-Type: ${type}; charset=UTF-8`,
      "Content-Transfer-Encoding: base64",
      "",
      base64Body(body),
    ].join("\r\n");
  return [
    `From: ${formatAddress(message.from)}`,
    `To: ${formatAddress({ address: message.to })}`,
    ...(message.replyTo ? [`Reply-To: ${formatAddress({ address: message.replyTo })}`] : []),
    `Subject: ${headerText(message.subject)}`,
    `Date: ${date.toUTCString().replace(/GMT$/, "+0000")}`,
    `Message-ID: <${id}@${domain}>`,
    "MIME-Version: 1.0",
    "Content-Type: multipart/alternative;",
    ` boundary="${boundary}"`,
    "",
    part("text/plain", message.text),
    part("text/html", message.html),
    `--${boundary}--`,
  ].join("\r\n");
}

/** A line that starts with "." would end the message early, so SMTP requires doubling it. */
function dotStuff(data: string) {
  return data.replace(/^\./gm, "..");
}

type Reply = { code: number; text: string };

/** Collects the server's replies; a reply may span several lines ("250-..." then "250 ..."). */
function replyReader(socket: SmtpSocket) {
  const decoder = new TextDecoder();
  const replies: Reply[] = [];
  let pending = "";
  let lines: string[] = [];
  let failure: Error | undefined;
  let waiter: { resolve: (reply: Reply) => void; reject: (error: Error) => void } | undefined;

  const settle = () => {
    if (!waiter) return;
    const reply = replies.shift();
    if (reply) waiter.resolve(reply);
    else if (failure) waiter.reject(failure);
    else return;
    waiter = undefined;
  };
  const fail = (error: Error) => {
    failure ??= error;
    settle();
  };

  socket.on("data", (chunk) => {
    pending +=
      typeof chunk === "string" ? chunk : decoder.decode(chunk as Uint8Array, { stream: true });
    let end;
    while ((end = pending.indexOf("\n")) !== -1) {
      const line = pending.slice(0, end).replace(/\r$/, "");
      pending = pending.slice(end + 1);
      lines.push(line);
      if (line[3] !== "-") {
        replies.push({ code: Number.parseInt(line.slice(0, 3), 10), text: lines.join(" | ") });
        lines = [];
      }
    }
    settle();
  });
  socket.on("error", (error) => fail(error instanceof Error ? error : new Error(String(error))));
  socket.on("close", () => fail(new Error("The mail server closed the connection.")));

  return () =>
    new Promise<Reply>((resolve, reject) => {
      waiter = { resolve, reject };
      settle();
    });
}

/**
 * Sends one message. Resolves once the server has accepted it for delivery; rejects otherwise.
 * Error messages carry the server's reply, never the password.
 */
export async function sendMail(
  config: SmtpConfig,
  message: MailMessage,
  connect: SmtpConnect = connectTls,
) {
  const from = checkAddress(message.from.address);
  const to = checkAddress(message.to);
  const data = dotStuff(buildMimeMessage(message, new Date(), crypto.randomUUID()));
  const login = Buffer.from(`\0${config.user}\0${config.pass}`, "utf8").toString("base64");

  const socket = connect(config.host, config.port);
  const read = replyReader(socket);
  const step = async (label: string, command: string | undefined, ...expected: number[]) => {
    if (command !== undefined) socket.write(`${command}\r\n`);
    const reply = await read();
    if (!expected.includes(reply.code))
      throw new SmtpError(reply.code, `${label} was refused: ${reply.text}`);
  };

  // Once the server accepts the message it will be delivered, so nothing after that point may turn
  // into a failure — otherwise the visitor would retry and NetSwagger would get the inquiry twice.
  let accepted = false;
  const exchange = (async () => {
    await step("Connection", undefined, 220);
    await step("Greeting", `EHLO ${from.split("@")[1] ?? "localhost"}`, 250);
    await step("Login", `AUTH PLAIN ${login}`, 235);
    await step("Sender", `MAIL FROM:<${from}>`, 250);
    await step("Recipient", `RCPT TO:<${to}>`, 250, 251);
    await step("Message start", "DATA", 354);
    await step("Message", `${data}\r\n.`, 250);
    accepted = true;
    socket.write("QUIT\r\n");
    await read().catch(() => undefined);
  })();

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${config.host} did not respond in time.`)),
      config.timeoutMs ?? 20_000,
    );
  });
  try {
    await Promise.race([exchange, timeout]);
  } catch (error) {
    if (!accepted) throw error;
  } finally {
    clearTimeout(timer);
    socket.destroy();
  }
}
