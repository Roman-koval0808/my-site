import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import net from "node:net";
import { test } from "node:test";
import { SmtpError, buildMimeMessage, sendMail } from "../src/lib/smtp.server.ts";
import type { MailMessage, SmtpConfig, SmtpConnect } from "../src/lib/smtp.server.ts";

const message: MailMessage = {
  from: { name: "NetSwagger Website", address: "website@netswagger.org" },
  to: "info@netswagger.org",
  replyTo: "ada@example.com",
  subject: "New Website Inquiry — Ada Lovelace",
  text: "Line one.\nLine two — ünïcödé.",
  html: "<p>Hello</p>",
};
const config: SmtpConfig = {
  host: "fake.test",
  port: 465,
  user: "website@netswagger.org",
  pass: "s3cret-password",
};
const date = new Date("2026-09-16T15:04:05Z");

function headersOf(raw: string) {
  return (raw.split("\r\n\r\n")[0] ?? "").replace(/\r\n /g, " ");
}
function decodeWords(value: string) {
  return value
    .replace(/\?=\s+=\?/g, "?==?")
    .replace(/=\?UTF-8\?B\?([^?]*)\?=/g, (_, encoded: string) =>
      Buffer.from(encoded, "base64").toString("utf8"),
    );
}
function bodiesOf(raw: string) {
  const boundary = /boundary="([^"]+)"/.exec(headersOf(raw))?.[1] ?? "";
  return raw
    .split(`--${boundary}`)
    .slice(1, -1)
    .map((part) => {
      const [head = "", body = ""] = part.split("\r\n\r\n");
      return { head, text: Buffer.from(body.replace(/\s/g, ""), "base64").toString("utf8") };
    });
}

test("the message has every header, with the subject encoded", () => {
  const raw = buildMimeMessage(message, date, "abc");
  const headers = headersOf(raw);
  assert.match(headers, /^From: "NetSwagger Website" <website@netswagger\.org>$/m);
  assert.match(headers, /^To: <info@netswagger\.org>$/m);
  assert.match(headers, /^Reply-To: <ada@example\.com>$/m);
  assert.match(headers, /^Date: Wed, 16 Sep 2026 15:04:05 \+0000$/m);
  assert.match(headers, /^Message-ID: <abc@netswagger\.org>$/m);
  const subject = /^Subject: (.*)$/m.exec(headers)?.[1] ?? "";
  assert.equal(decodeWords(subject), "New Website Inquiry — Ada Lovelace");
});

test("the raw message is ASCII, CRLF-only, and within line limits", () => {
  const raw = buildMimeMessage({ ...message, subject: "é".repeat(150) }, date, "abc");
  assert.ok(
    [...raw].every((character) => character.charCodeAt(0) < 128),
    "non-ASCII reached the wire",
  );
  assert.ok(!/[^\r]\n/.test(raw), "bare LF in message");
  for (const line of raw.split("\r\n")) assert.ok(line.length <= 78, `line too long: ${line}`);
  const subject = /^Subject: (.*)$/m.exec(headersOf(raw))?.[1] ?? "";
  assert.equal(decodeWords(subject), "é".repeat(150));
});

test("both bodies decode to the original content with CRLF line endings", () => {
  const [plain, html] = bodiesOf(buildMimeMessage(message, date, "abc"));
  assert.match(plain?.head ?? "", /text\/plain; charset=UTF-8/);
  assert.equal(plain?.text, "Line one.\r\nLine two — ünïcödé.");
  assert.match(html?.head ?? "", /text\/html; charset=UTF-8/);
  assert.equal(html?.text, "<p>Hello</p>");
});

test("line breaks cannot inject headers", () => {
  const raw = buildMimeMessage({ ...message, subject: "Hi\r\nBcc: x@example.com" }, date, "abc");
  assert.ok(!/^Bcc:/m.test(raw));
  assert.throws(() =>
    buildMimeMessage({ ...message, replyTo: "a@example.com>\r\nBcc: <x@example.com" }, date, "a"),
  );
});

type FakeOptions = { greet?: boolean; hangUp?: boolean; auth?: string; afterData?: string };

/** A plain-TCP stand-in for the mail server that records what the client sends. */
async function fakeServer(options: FakeOptions = {}) {
  const commands: string[] = [];
  let received = "";
  const server = net.createServer((socket) => {
    socket.on("error", () => undefined);
    if (options.hangUp) return void socket.destroy();
    const reply = (text: string) => socket.write(`${text}\r\n`);
    if (options.greet !== false) reply("220 fake.test ready");
    let buffer = "";
    let inData = false;
    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      let end;
      while ((end = buffer.indexOf("\r\n")) !== -1) {
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        if (inData) {
          if (line === ".") {
            inData = false;
            reply(options.afterData ?? "250 2.0.0 queued");
          } else received += `${line}\r\n`;
          continue;
        }
        commands.push(line);
        const verb = line.split(" ")[0];
        if (verb === "EHLO") reply("250-fake.test\r\n250-AUTH PLAIN LOGIN\r\n250 PIPELINING");
        else if (verb === "AUTH") reply(options.auth ?? "235 2.7.0 Authentication successful");
        else if (verb === "DATA") {
          inData = true;
          reply("354 go ahead");
        } else if (verb === "QUIT") {
          reply("221 bye");
          socket.end();
        } else reply("250 2.1.0 ok");
      }
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as net.AddressInfo;
  const connect: SmtpConnect = () => net.connect({ host: "127.0.0.1", port });
  return {
    commands,
    connect,
    received: () => received,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}

test("a successful exchange logs in, addresses the envelope, and sends the message", async () => {
  const server = await fakeServer();
  try {
    await sendMail(config, message, server.connect);
    assert.deepEqual(
      server.commands.map((command) => command.split(" ")[0]),
      ["EHLO", "AUTH", "MAIL", "RCPT", "DATA", "QUIT"],
    );
    assert.equal(server.commands[0], "EHLO netswagger.org");
    const [, mechanism, credentials = ""] = server.commands[1]?.split(" ") ?? [];
    assert.equal(mechanism, "PLAIN");
    assert.equal(
      Buffer.from(credentials, "base64").toString("utf8"),
      "\0website@netswagger.org\0s3cret-password",
    );
    assert.equal(server.commands[2], "MAIL FROM:<website@netswagger.org>");
    assert.equal(server.commands[3], "RCPT TO:<info@netswagger.org>");
    assert.match(server.received(), /^Reply-To: <ada@example\.com>$/m);
  } finally {
    await server.close();
  }
});

test("a refused login fails with the server's code, stops, and never echoes the password", async () => {
  const server = await fakeServer({ auth: "535 5.7.8 Error: authentication failed" });
  try {
    await assert.rejects(sendMail(config, message, server.connect), (error) => {
      assert.ok(error instanceof SmtpError);
      assert.equal(error.code, 535);
      assert.ok(!error.message.includes("s3cret-password"));
      return true;
    });
    assert.ok(!server.commands.some((command) => command.startsWith("MAIL")));
  } finally {
    await server.close();
  }
});

test("a refused message is a failure", async () => {
  const server = await fakeServer({ afterData: "554 5.7.1 Message rejected" });
  try {
    await assert.rejects(
      sendMail(config, message, server.connect),
      (error) => error instanceof SmtpError && error.code === 554,
    );
  } finally {
    await server.close();
  }
});

test("a silent server times out instead of hanging", async () => {
  const server = await fakeServer({ greet: false });
  try {
    await assert.rejects(
      sendMail({ ...config, timeoutMs: 200 }, message, server.connect),
      /did not respond in time/,
    );
  } finally {
    await server.close();
  }
});

test("a dropped connection is a failure", async () => {
  const server = await fakeServer({ hangUp: true });
  try {
    await assert.rejects(sendMail(config, message, server.connect), /closed the connection/);
  } finally {
    await server.close();
  }
});

test("an unreachable server is a failure", async () => {
  const server = await fakeServer();
  const { connect } = server;
  await server.close();
  await assert.rejects(sendMail(config, message, connect), /ECONNREFUSED/);
});
