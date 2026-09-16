import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ContactSection } from "@/components/contact-section";
import { CertificationsSection, ClientsSection } from "@/components/trust-sections";
import { TechnologiesSection } from "@/components/technologies-section";
import {
  ArrowRight,
  ArrowUpRight,
  Smartphone,
  Globe2,
  PencilRuler,
  Code2,
  MessageCircle,
  HeartHandshake,
  ScanEye,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Check,
  Layers,
  Apple,
  CircleDot,
} from "lucide-react";
import logo from "@/assets/netswagger-logo.png";
import picmi from "@/assets/portfolio/picmi.jpg";
import fieldr from "@/assets/portfolio/fieldr.jpg";
import craftMusic from "@/assets/portfolio/craft-music.jpg";
import v1Sports from "@/assets/portfolio/v1-sports.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NetSwagger | Thoughtful Software. Real Partnership." },
      {
        name: "description",
        content:
          "Mobile apps, web development and intuitive UX/UI design. NetSwagger gives your software project the focus it deserves. Get a free consultation.",
      },
      { property: "og:title", content: "NetSwagger | Mobile & Web Development" },
      {
        property: "og:description",
        content:
          "Thoughtful software. Real partnership. Mobile, web and UX/UI development with NetSwagger.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const services = [
  {
    icon: Smartphone,
    title: "Mobile Development",
    text: "Your idea, in the hands of your users. Mobile experiences built around real needs.",
    tag: "Made for everyday life",
  },
  {
    icon: Globe2,
    title: "Web Development",
    text: "Purposeful websites and web applications that bring your business to life online.",
    tag: "Built for the browser",
  },
  {
    icon: Apple,
    title: "iOS Development",
    text: "Thoughtful apps that feel right at home on Apple devices.",
    tag: "Native Apple experiences",
  },
  {
    icon: CircleDot,
    title: "Android Development",
    text: "Reliable, intuitive applications for the diverse world of Android.",
    tag: "Designed for Android",
  },
  {
    icon: Layers,
    title: "React Native",
    text: "A connected mobile experience across iOS and Android with cross-platform development.",
    tag: "Two platforms. One vision.",
  },
  {
    icon: PencilRuler,
    title: "UX/UI Design",
    text: "Clear user journeys and considered interfaces that make complex things feel simple.",
    tag: "People at the center",
  },
];
const projects = [
  {
    name: "PICMI",
    category: "SOCIAL & DATING",
    description:
      "A social dating app with over 100 categories to match on, developed for iOS & Android.",
    image: picmi,
    color: "yellow",
    tags: ["iOS", "Android"],
  },
  {
    name: "FIELDR",
    category: "CREATIVE COMMUNITY",
    description: "A way for creative entrepreneurs to share their talents and win contests.",
    image: fieldr,
    color: "blue",
    tags: ["Mobile app"],
  },
  {
    name: "CRAFT MUSIC",
    category: "MUSIC & COLLABORATION",
    description: "A music collaboration app for both fans and professional musicians.",
    image: craftMusic,
    color: "pink",
    tags: ["Mobile app"],
  },
  {
    name: "V1 SPORTS",
    category: "SPORTS & COACHING",
    description: "A suite of sports apps for coaches and students.",
    image: v1Sports,
    color: "green",
    tags: ["App suite"],
  },
];
const otherProjects = [
  ["YSELFIE", "Ecommerce", "An ecommerce platform where influencers connect directly with fans."],
  ["KLIQUE", "iOS & Android", "A dating app with rewards developed for iOS and Android."],
  ["NEXUS", "Conceptual design", "A conceptual design for a state-of-the-art electronics app."],
  ["CUCINA", "Conceptual design", "A conceptual app design for health-conscious food ordering."],
];
const values = [
  {
    icon: Code2,
    title: "Expertise with purpose",
    text: "Developers, designers and strategists aligned around your goals.",
  },
  {
    icon: MessageCircle,
    title: "Clear communication",
    text: "A collaborative relationship that keeps everyone on the same page.",
  },
  {
    icon: ScanEye,
    title: "Transparency, always",
    text: "An open approach to the work, the decisions and the way forward.",
  },
  {
    icon: HeartHandshake,
    title: "Personally invested",
    text: "We focus on your software development project like it's our own.",
  },
];
const navigation = [
  ["Services", "services"],
  ["Our work", "work"],
  ["Why NetSwagger", "why"],
  ["Our process", "process"],
];
function Brand() {
  return (
    <span className="brand">
      <img src={logo} alt="" width="42" height="46" />
      <span>
        NetSwagger<span className="brand-dot">.</span>
      </span>
    </span>
  );
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span />
      {children}
    </p>
  );
}
function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  return (
    <div className="site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <nav className="shell nav" aria-label="Main navigation">
          <a href="#top" aria-label="NetSwagger home">
            <Brand />
          </a>
          <div className="desktop-nav">
            {navigation.map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </div>
          <a href="#contact" className="button button-small nav-cta">
            Let's talk <ArrowUpRight size={16} />
          </a>
          <button
            className="menu-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>
        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setMenuOpen(false);
                document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
              }
            }}
          >
            {[...navigation, ["Free consultation", "contact"]].map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </nav>
        )}
      </header>
      <main id="main">
        <section id="top" className="hero shell">
          <div className="hero-copy reveal-up">
            <Eyebrow>YOUR SOFTWARE DEVELOPMENT PARTNER</Eyebrow>
            <h1>
              Thoughtful software.
              <br />
              <span>Real partnership.</span>
            </h1>
            <p className="hero-description">
              We turn your ideas into mobile apps and web experiences people love to use. With the
              care, clarity and dedication your project deserves.
            </p>
            <div className="hero-actions">
              <a className="button" href="#contact">
                Free consultation <ArrowUpRight size={18} />
              </a>
              <a className="text-link" href="#work">
                Explore our work <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-note">
              <span className="note-icon">
                <HeartHandshake size={18} />
              </span>
              <p>
                Your vision. Our focus.
                <br />
                <strong>A team invested in your success.</strong>
              </p>
            </div>
          </div>
          <div
            className="hero-visual reveal-up"
            aria-label="Selected NetSwagger mobile app projects"
          >
            <div className="visual-topline">
              <span>
                <span className="status-dot" /> IDEAS, BROUGHT TO LIFE
              </span>
              <Code2 size={18} />
            </div>
            <div className="hero-project hero-project-back">
              <div className="mini-title">
                <span>FIELDR</span>
                <ArrowUpRight size={16} />
              </div>
              <img
                src={fieldr}
                alt="Fieldr creative community app screens"
                width="1200"
                height="840"
              />
            </div>
            <div className="hero-project hero-project-front">
              <div className="mini-title">
                <span>PICMI</span>
                <span>iOS / Android</span>
              </div>
              <img
                src={picmi}
                alt="Picmi social dating app screens"
                width="1200"
                height="840"
                fetchPriority="high"
              />
            </div>
            <div className="visual-tag">
              <span>
                <Check size={18} />
              </span>
              <div>
                Built around people.<small>Designed with purpose.</small>
              </div>
            </div>
            <div className="visual-bottom">
              <span>MOBILE · WEB · UX/UI</span>
              <span>
                From idea to experience <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </section>
        <div className="expertise-strip">
          <div className="shell">
            <span>
              THOUGHTFULLY BUILT.
              <br />
              <strong>Across every screen.</strong>
            </span>
            <span>
              <Apple />
              iOS
            </span>
            <span>
              <CircleDot />
              Android
            </span>
            <span>
              <Layers />
              React Native
            </span>
            <span>
              <Globe2 />
              Web
            </span>
            <span>
              <PencilRuler />
              UX/UI Design
            </span>
          </div>
        </div>
        <section id="services" className="section shell">
          <div className="section-heading">
            <div>
              <Eyebrow>WHAT WE DO</Eyebrow>
              <h2>
                Big ideas. <span>Expertly built.</span>
              </h2>
            </div>
            <p>
              From the first sketch to the final experience, our mobile, web and design expertise
              brings your vision together.
            </p>
          </div>
          <div className="services-grid">
            {services.map(({ icon: Icon, ...service }, index) => (
              <article className="service-card" key={service.title}>
                <div className="card-top">
                  <span className="service-icon">
                    <Icon size={23} strokeWidth={1.6} />
                  </span>
                  <span className="service-number">0{index + 1}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="service-tag">{service.tag}</div>
              </article>
            ))}
          </div>
        </section>
        <TechnologiesSection />
        <section id="why" className="why-section">
          <div className="shell why-grid">
            <div>
              <Eyebrow>WHY NETSWAGGER</Eyebrow>
              <h2>
                Your project.
                <br />
                Our full commitment.
              </h2>
              <p className="section-description">
                Great software starts with a great working relationship. We bring passion and
                transparency to every step of yours.
              </p>
              <a className="text-link" href="#contact">
                Meet your development partner <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="values-grid">
              {values.map(({ icon: Icon, title, text }) => (
                <article key={title}>
                  <Icon className="value-icon" size={24} strokeWidth={1.6} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="work" className="section shell">
          <div className="section-heading">
            <div>
              <Eyebrow>SELECTED WORK</Eyebrow>
              <h2>
                Ideas made <span>real.</span>
              </h2>
            </div>
            <p>
              Different ambitions. The same dedication.
              <br />
              Explore a few of the products we've helped bring to life.
            </p>
          </div>
          <div className="work-disciplines" aria-label="Our areas of expertise">
            <span>
              <Smartphone size={15} strokeWidth={1.5} /> Mobile apps
            </span>
            <span>
              <Globe2 size={15} strokeWidth={1.5} /> Web experiences
            </span>
            <span>
              <PencilRuler size={15} strokeWidth={1.5} /> UX/UI design
            </span>
          </div>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <article
                className="project-card"
                key={project.name}
                aria-labelledby={`project-${index}`}
              >
                <div className={`project-image ${project.color}`}>
                  <div className="project-visual-label" aria-hidden="true">
                    <span>{project.name}</span>
                    <span>0{index + 1}</span>
                  </div>
                  <img
                    src={project.image}
                    alt={`${project.name} application screens`}
                    loading="lazy"
                    width="1200"
                    height="840"
                  />
                </div>
                <div className="project-info">
                  <div className="project-meta">
                    <span className="project-category">{project.category}</span>
                    <span className="project-platforms">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </span>
                  </div>
                  <h3 id={`project-${index}`}>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="more-work">
            <button
              className="button button-outline"
              onClick={() => setShowAll(!showAll)}
              aria-expanded={showAll}
              aria-controls="more-projects"
            >
              {showAll ? "Show selected work" : "Explore more projects"}
              <ArrowRight size={17} className={showAll ? "rotate-arrow" : ""} />
            </button>
          </div>
          <div id="more-projects" hidden={!showAll}>
            <div className="other-projects">
              {otherProjects.map(([name, category, description]) => (
                <article key={name}>
                  <span className="project-category">{category}</span>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="testimonials-section">
          <div className="shell">
            <div className="center-heading">
              <Eyebrow>IN OUR CLIENTS' WORDS</Eyebrow>
              <h2>
                Good work. <span>Great relationships.</span>
              </h2>
            </div>
            <figure className="lead-quote">
              <span className="quote-mark" aria-hidden="true">
                “
              </span>
              <blockquote>
                NetSwagger has enormous dedication, energy and enthusiasm. They successfully manage
                diverse skills of their talented group to build technically challenging projects.
              </blockquote>
              <figcaption>
                <span className="avatar">BS</span>
                <span>
                  Bob Sutton<small>NetSwagger client</small>
                </span>
              </figcaption>
            </figure>
            <div className="testimonial-grid">
              {[
                [
                  "The team did a tremendous job undersanding what I envisioned and impressively brought it to life.",
                  "Brian E.",
                  "BE",
                ],
                ["I was very happy with their intent focus on my project needs.", "Seth G.", "SG"],
                ["They were always on time and very communicative.", "Daniel D.", "DD"],
              ].map(([quote, name, initials]) => (
                <figure key={name}>
                  <span className="small-quote" aria-hidden="true">
                    “
                  </span>
                  <blockquote>{quote}</blockquote>
                  <figcaption>
                    <span className="avatar">{initials}</span>
                    {name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
        <section id="process" className="section shell">
          <div className="section-heading">
            <div>
              <Eyebrow>HOW WE WORK</Eyebrow>
              <h2>
                A clear path.
                <br />
                <span>A shared destination.</span>
              </h2>
            </div>
            <p>Collaboration at every step, with your vision and your users at the center.</p>
          </div>
          <ol className="process-grid">
            {[
              ["Discover", "We get to know your idea, your users and what success means to you."],
              [
                "Design",
                "We shape the experience through user journeys, wireframes and interface design.",
              ],
              ["Develop", "We bring the design to life with focused mobile and web development."],
              [
                "Test & launch",
                "We check functionality and usability, then prepare your product for launch.",
              ],
            ].map(([title, text], i) => (
              <li key={title}>
                <div className="step-number">
                  0{i + 1}
                  <ArrowRight size={17} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>
        <CertificationsSection />
        <ClientsSection />
        <ContactSection />
      </main>
      <footer className="site-footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <a href="#top" aria-label="NetSwagger home">
              <Brand />
            </a>
            <p>
              Thoughtful software.
              <br />A team that cares.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            {navigation.map(([label, id]) => (
              <a href={`#${id}`} key={id}>
                {label}
              </a>
            ))}
          </div>
          <div>
            <h3>Let's connect</h3>
            <a href="mailto:info@netswagger.org">
              <Mail size={15} /> info@netswagger.org
            </a>
            <a href="tel:+13362986469">
              <Phone size={15} /> 336-298-6469
            </a>
          </div>
          <div>
            <h3>Find us</h3>
            <address>
              <MapPin size={16} />
              <span>
                NetSwagger Enterprises LLC
                <br />
                5762 Tomahawk Rd
                <br />
                Winston-Salem, NC 27106
              </span>
            </address>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>© 2026 NetSwagger Enterprises LLC. All rights reserved.</span>
          <a href="https://www.netswagger.org/privacy-policy">Privacy policy</a>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}
