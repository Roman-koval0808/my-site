import { notFound } from "next/navigation";
import type { Metadata } from "next";

const process = [
  {
    title: "Discovery",
    copy: "We align on your audience, goals, requirements, constraints, and the clearest roadmap for the product.",
    image: "https://images.squarespace-cdn.com/content/v1/5c8bff92523958908c39db54/419550b9-e73a-409f-a8eb-1c0c24d0d475/discovery.jpg?format=1000w",
  },
  {
    title: "Design",
    copy: "We shape the experience through wireframes, prototypes, visual systems, and focused feedback loops.",
    image: "https://images.squarespace-cdn.com/content/v1/5c8bff92523958908c39db54/0ac05509-77a9-410a-a07f-76aeafc59d6c/design.jpg?format=1000w",
  },
  {
    title: "Development",
    copy: "We turn the approved direction into maintainable, tested software with visible progress throughout delivery.",
    image: "https://images.squarespace-cdn.com/content/v1/5c8bff92523958908c39db54/c4d77e35-1849-45e7-9cca-8865400b4c18/development.jpg?format=1000w",
  },
  {
    title: "Testing",
    copy: "We validate functionality, responsiveness, usability, and reliability across real devices and scenarios.",
    image: "https://images.squarespace-cdn.com/content/v1/5c8bff92523958908c39db54/a22cdb8f-6dd9-4e79-99a1-c4d52e05f589/testing.jpg?format=1000w",
  },
  {
    title: "Launch",
    copy: "We prepare the product for release, monitor the experience, and keep improving it after launch.",
    image: "https://images.squarespace-cdn.com/content/v1/5c8bff92523958908c39db54/dd0c262b-eeb0-4be6-8d8b-c61bb1aada29/launch.jpg?format=1000w",
  },
];

const services = {
  "mobile-app-development": {
    title: "Mobile App Development",
    hero: "Build your iOS, Android, or Cross-Platform application",
    intro: "Build your iOS, Android, or Cross-Platform mobile app with a team that brings strategy, design, and engineering together.",
    accent: "#a7cf35",
  },
  "web-development": {
    title: "Web Development",
    hero: "Build your website knowing you have a partner you can trust.",
    intro: "Your website, our expertise: create something extraordinary with a fast, responsive product built to grow.",
    accent: "#1e4f8e",
  },
  uiux: {
    title: "UX/UI Design",
    hero: "Make your app easy to understand, easy to use, and functionally sound with expert design.",
    intro: "Creating impactful brand experiences through intuitive, elegant design and thoughtful product strategy.",
    accent: "#f5b432",
  },
} as const;

type ServiceSlug = keyof typeof services;

export function generateStaticParams() {
  return Object.keys(services).map((service) => ({ service }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service } = await params;
  const content = services[service as ServiceSlug];
  return content ? { title: `${content.title} | NetSwagger` } : { title: "NetSwagger" };
}

export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  const content = services[service as ServiceSlug];

  if (!content) notFound();

  const isDesign = service === "uiux";

  return (
    <main className="servicePage" style={{ "--service-accent": content.accent } as React.CSSProperties}>
      <header className="serviceHeader">
        <a href="/" className="serviceBrand" aria-label="NetSwagger home">
          <img src="/netswagger-logo.svg" alt="NetSwagger" />
        </a>
        <a className="headerCta" href="mailto:info@netswagger.org?subject=Free%20Consultation">Speak to an expert</a>
      </header>

      <section className="serviceHero">
        <div className="shell serviceHeroContent">
          <p className="sectionKicker">NetSwagger services</p>
          <h1>{content.title}</h1>
          <p className="serviceHeroLead">{content.hero}</p>
          <a className="primaryButton" href="mailto:info@netswagger.org?subject=Start%20a%20project">Start now <span aria-hidden="true">-&gt;</span></a>
        </div>
      </section>

      <section className="serviceIntro shell">
        <p className="sectionKicker">{isDesign ? "Creating impactful brand experiences" : "Software development"}</p>
        <h2>{content.intro}</h2>
      </section>

      <section className="serviceProcessSection">
        <div className="shell">
          <div className="serviceSectionHeading">
            <p className="sectionKicker">Our proven process</p>
            <h2>Five steps from idea to launch.</h2>
          </div>
          <div className="serviceProcessGrid">
            {process.map((step, index) => (
              <article className="serviceProcessCard" key={step.title}>
                <img src={step.image} alt={`${step.title} phase`} />
                <span>0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="serviceCta">
        <div className="shell serviceCtaInner">
          <p className="sectionKicker">Let&apos;s start talking about your project today</p>
          <h2>Ready to make it real?</h2>
          <a className="primaryButton primaryButtonLight" href="mailto:info@netswagger.org?subject=Free%20Consultation">Get your free consultation <span aria-hidden="true">-&gt;</span></a>
        </div>
      </section>

      <footer className="serviceFooter"><a href="/">NetSwagger</a><span>App, web, and product development with care and momentum.</span></footer>
    </main>
  );
}
