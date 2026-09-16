import type { CSSProperties } from "react";
import awsMark from "@/assets/tech/amazonwebservices.svg?raw";
import androidMark from "@/assets/tech/android.svg?raw";
import dockerMark from "@/assets/tech/docker.svg?raw";
import figmaMark from "@/assets/tech/figma.svg?raw";
import firebaseMark from "@/assets/tech/firebase.svg?raw";
import javascriptMark from "@/assets/tech/javascript.svg?raw";
import kotlinMark from "@/assets/tech/kotlin.svg?raw";
import nodeMark from "@/assets/tech/nodedotjs.svg?raw";
import postgresMark from "@/assets/tech/postgresql.svg?raw";
import reactMark from "@/assets/tech/react.svg?raw";
import swiftMark from "@/assets/tech/swift.svg?raw";
import typescriptMark from "@/assets/tech/typescript.svg?raw";

/**
 * Tools NetSwagger builds with. Remove anything the team doesn't actually use. To add one, save its
 * icon into `src/assets/tech/` (simpleicons.org, CC0) and copy a row below.
 *
 * `color` is the brand colour the grey icon takes on hover. A couple are nudged darker than the
 * official tint so they stay visible on white. React Native is represented by the React mark.
 *
 * The icons are imported with `?raw` and inlined as real SVG nodes so CSS can colour them. Don't
 * switch this to a CSS `mask`: Vite inlines small assets as data URIs containing quotes, which
 * makes `url()` invalid and silently drops the mask, leaving blank squares.
 */
const technologies = [
  { id: "swift", name: "Swift", svg: swiftMark, color: "#f05138" },
  { id: "kotlin", name: "Kotlin", svg: kotlinMark, color: "#7f52ff" },
  { id: "android", name: "Android", svg: androidMark, color: "#34a853" },
  { id: "react", name: "React", svg: reactMark, color: "#149eca" },
  { id: "typescript", name: "TypeScript", svg: typescriptMark, color: "#3178c6" },
  { id: "javascript", name: "JavaScript", svg: javascriptMark, color: "#c8a800" },
  { id: "node", name: "Node.js", svg: nodeMark, color: "#5fa04e" },
  { id: "postgresql", name: "PostgreSQL", svg: postgresMark, color: "#4169e1" },
  { id: "firebase", name: "Firebase", svg: firebaseMark, color: "#dd2c00" },
  { id: "aws", name: "AWS", svg: awsMark, color: "#ff9900" },
  { id: "docker", name: "Docker", svg: dockerMark, color: "#2496ed" },
  { id: "figma", name: "Figma", svg: figmaMark, color: "#f24e1e" },
];

export function TechnologiesSection() {
  return (
    <section
      id="technologies"
      className="shell tech-section"
      aria-labelledby="technologies-heading"
    >
      <div className="tech-heading">
        <p className="eyebrow">
          <span />
          OUR TOOLKIT
        </p>
        <h2 id="technologies-heading">
          Technologies we <span>work with</span>
        </h2>
        <p>The languages, frameworks and platforms behind the products we build.</p>
      </div>
      <ul className="tech-grid">
        {technologies.map((tech) => (
          <li
            className="tech-item"
            key={tech.id}
            style={{ "--brand": tech.color } as CSSProperties}
          >
            <span
              className="tech-mark"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: tech.svg }}
            />
            <p className="tech-name">{tech.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
