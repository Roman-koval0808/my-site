import type { CSSProperties } from "react";
import awsMark from "@/assets/tech/amazonwebservices.svg";
import androidMark from "@/assets/tech/android.svg";
import dockerMark from "@/assets/tech/docker.svg";
import figmaMark from "@/assets/tech/figma.svg";
import firebaseMark from "@/assets/tech/firebase.svg";
import javascriptMark from "@/assets/tech/javascript.svg";
import kotlinMark from "@/assets/tech/kotlin.svg";
import nodeMark from "@/assets/tech/nodedotjs.svg";
import postgresMark from "@/assets/tech/postgresql.svg";
import reactMark from "@/assets/tech/react.svg";
import swiftMark from "@/assets/tech/swift.svg";
import typescriptMark from "@/assets/tech/typescript.svg";

/**
 * Tools NetSwagger builds with. Remove anything the team doesn't actually use. To add one, save its
 * icon into `src/assets/tech/` (simpleicons.org, CC0) and copy a row below.
 *
 * `color` is the brand colour the grey icon fades into on hover. A couple are nudged darker than
 * the official tint so they stay visible on white. React Native is represented by the React mark.
 */
const technologies = [
  { id: "swift", name: "Swift", mark: swiftMark, color: "#f05138" },
  { id: "kotlin", name: "Kotlin", mark: kotlinMark, color: "#7f52ff" },
  { id: "android", name: "Android", mark: androidMark, color: "#34a853" },
  { id: "react", name: "React", mark: reactMark, color: "#149eca" },
  { id: "typescript", name: "TypeScript", mark: typescriptMark, color: "#3178c6" },
  { id: "javascript", name: "JavaScript", mark: javascriptMark, color: "#c8a800" },
  { id: "node", name: "Node.js", mark: nodeMark, color: "#5fa04e" },
  { id: "postgresql", name: "PostgreSQL", mark: postgresMark, color: "#4169e1" },
  { id: "firebase", name: "Firebase", mark: firebaseMark, color: "#dd2c00" },
  { id: "aws", name: "AWS", mark: awsMark, color: "#ff9900" },
  { id: "docker", name: "Docker", mark: dockerMark, color: "#2496ed" },
  { id: "figma", name: "Figma", mark: figmaMark, color: "#f24e1e" },
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
            style={{ "--mark": `url(${tech.mark})`, "--brand": tech.color } as CSSProperties}
          >
            <span className="tech-mark" aria-hidden="true" />
            <p className="tech-name">{tech.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
