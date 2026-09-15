const services = [
  {
    title: "iOS, Android and Cross-Platform Development",
    copy: "Build polished mobile experiences for iOS, Android, and multiple platforms from one focused product vision.",
    icon: "mobile",
    image: "https://images.squarespace-cdn.com/content/v1/5c8bff92523958908c39db54/9a595acf-4cae-4687-85ce-79445700d282/ios.jpg?format=1500w",
  },
  {
    title: "Web Development",
    copy: "Create fast, responsive web products that are easy to use, discover, and grow.",
    icon: "code",
    image: "https://images.squarespace-cdn.com/content/v1/5c8bff92523958908c39db54/d40f137e-ffe5-4308-bef8-d55dd90ed95f/web3.jpg?format=1500w",
  },
  {
    title: "UX/UI Design",
    copy: "Turn complex ideas into intuitive product flows, prototypes, and interfaces people enjoy using.",
    icon: "pen",
    image: "https://images.squarespace-cdn.com/content/v1/5c8bff92523958908c39db54/4c890a73-ec98-46e2-b1c9-cfbe9b181e82/ux.jpg?format=1500w",
  },
];

const work = [
  {
    name: "PICMI",
    description: "A social dating app with more than 100 categories to match on, developed for iOS and Android.",
    tag: "Social / Mobile",
    art: "artPicmi",
    image: "https://static1.squarespace.com/static/5c8bff92523958908c39db54/t/65e3a6d37141403e0522fd40/1709418195627/picmi_optimized1.jpg",
  },
  {
    name: "FIELDR",
    description: "A platform where creative entrepreneurs can share their talents and compete in contests.",
    tag: "Creator Platform",
    art: "artFieldr",
    image: "https://static1.squarespace.com/static/5c8bff92523958908c39db54/t/65e3a7049b098d12b887e746/1709418244655/fieldr_optimized1.jpg",
  },
  {
    name: "CRAFT MUSIC",
    description: "A music collaboration experience for fans, creators, and professional musicians.",
    tag: "Music / Community",
    art: "artCraft",
    image: "https://static1.squarespace.com/static/5c8bff92523958908c39db54/t/65e3a7d563807e327e0d4c65/1709418453687/craftmusic_optimized1.jpg",
  },
  {
    name: "V1 SPORTS",
    description: "A suite of sports applications built to connect coaches and students around better training.",
    tag: "Sports Tech",
    art: "artSports",
    image: "https://static1.squarespace.com/static/5c8bff92523958908c39db54/t/65e3a830d42469271b504e1b/1709418545095/v1sports_optimized1.jpg",
  },
  {
    name: "YSELFIE",
    description: "An ecommerce platform designed to connect influencers directly with their fans.",
    tag: "Commerce",
    art: "artSelfie",
    image: "https://static1.squarespace.com/static/5c8bff92523958908c39db54/t/65e3a81269e1e96311c12bf8/1709418514876/yselfie_optimized1.jpg",
  },
  {
    name: "KLIQUE",
    description: "A dating application with rewards, developed for both iOS and Android users.",
    tag: "Lifestyle / Mobile",
    art: "artKlique",
    image: "https://static1.squarespace.com/static/5c8bff92523958908c39db54/t/65e3a7f44a89925722d2b715/1709418484138/klique_optimized1.jpg",
  },
  {
    name: "NEXUS",
    description: "A conceptual electronics application exploring a modern, product-first shopping experience.",
    tag: "Concept / Commerce",
    art: "artNexus",
    image: "https://static1.squarespace.com/static/5c8bff92523958908c39db54/t/65e3a7b7c377fb263e60a409/1709418424083/nexus_optimized1.jpg",
  },
  {
    name: "CUCINA",
    description: "A conceptual app design for health-conscious food ordering with a fresh, visual interface.",
    tag: "Concept / Food",
    art: "artCucina",
    image: "https://static1.squarespace.com/static/5c8bff92523958908c39db54/t/65e3a793afb09f689aca5bca/1709418387442/cucina_optimized1.jpg",
  },
];

const testimonials = [
  {
    quote: "The team did a tremendous job understanding what I envisioned and impressively brought it to life.",
    author: "Brian E.",
  },
  {
    quote: "I was very happy with their intent focus on my project needs.",
    author: "Seth G.",
  },
  {
    quote: "They were always on time and very communicative.",
    author: "Daniel D.",
  },
];

const process = [
  ["01", "Discover", "Align on audience, outcomes, scope, constraints, and the clearest path from idea to launch."],
  ["02", "Design", "Shape the product through flows, wireframes, interface systems, and rapid feedback loops."],
  ["03", "Develop", "Build with practical architecture, maintainable code, and visible progress throughout delivery."],
  ["04", "Test", "Validate functionality, responsiveness, usability, and release readiness across the product."],
  ["05", "Launch", "Ship confidently, monitor the experience, and keep improving once real users arrive."],
];

function Icon({ name }: { name: string }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "mobile") {
    return <svg {...common}><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>;
  }
  if (name === "apple") {
    return <svg {...common}><path d="M15.2 6.2c.8-1 1.3-2.2 1.2-3.4-1.2.1-2.6.8-3.4 1.8-.8.9-1.4 2.1-1.3 3.3 1.3.1 2.7-.7 3.5-1.7Z"/><path d="M19 13.5c0-2.7 2.2-4 2.3-4.1-1.3-1.9-3.3-2.2-4-2.2-1.7-.2-3.3 1-4.2 1s-2.2-1-3.7-.9c-1.9 0-3.7 1.1-4.7 2.8-2 3.5-.5 8.7 1.4 11.5.9 1.4 2 2.9 3.5 2.8 1.4-.1 1.9-.9 3.6-.9 1.7 0 2.2.9 3.6.9 1.5 0 2.5-1.4 3.4-2.7 1.1-1.6 1.5-3.1 1.5-3.2-.1 0-2.7-1-2.7-5Z" transform="scale(.72) translate(4 2)"/></svg>;
  }
  if (name === "android") {
    return <svg {...common}><path d="M7 8h10a2 2 0 0 1 2 2v7H5v-7a2 2 0 0 1 2-2Z"/><path d="m8 5-1.5-2M16 5l1.5-2M8 17v4M16 17v4M5 11H3v5h2M19 11h2v5h-2"/><path d="M9 11h.01M15 11h.01"/></svg>;
  }
  if (name === "layers") {
    return <svg {...common}><path d="m12 2 8 4-8 4-8-4 8-4Z"/><path d="m4 10 8 4 8-4M4 14l8 4 8-4"/></svg>;
  }
  if (name === "code") {
    return <svg {...common}><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg>;
  }
  return <svg {...common}><path d="m4 20 4.5-1 9.8-9.8a2.1 2.1 0 0 0-3-3L5.5 16 4 20Z"/><path d="m13.8 7.7 2.5 2.5"/></svg>;
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <header className="siteHeader">
        <a href="#top" className="brand" aria-label="NetSwagger home">
          <img className="brandLogo" src="/netswagger-logo.svg" alt="NetSwagger" />
        </a>

        <nav className="desktopNav" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#reviews">Reviews</a>
        </nav>

        <a className="headerCta" href="mailto:info@netswagger.org?subject=Free%20Consultation">Speak to an expert <Arrow /></a>
      </header>

      <section className="hero" id="top">
        <div className="heroImage" aria-hidden="true" />
        <div className="heroNoise" aria-hidden="true" />
        <div className="heroGlow heroGlowOne" aria-hidden="true" />
        <div className="heroGlow heroGlowTwo" aria-hidden="true" />

        <div className="heroContent shell">
          <div className="eyebrow"><span className="eyebrowDot" /> App · Web · Product Design</div>
          <h1>Software, Mobile & Web Development <em>Solutions.</em></h1>
          <p className="heroLead">We focus on your software development project like it&apos;s our own—bringing strategy, design, and engineering together to turn ambitious ideas into polished digital products.</p>
          <div className="heroActions">
            <a className="primaryButton" href="mailto:info@netswagger.org?subject=Start%20a%20project">Start your project <Arrow /></a>
            <a className="textLink lightLink" href="#work">See our work <Arrow /></a>
          </div>
        </div>

        <div className="floatingCard floatingCardOne" aria-hidden="true">
          <div className="miniTop"><span /> <span /> <span /></div>
          <div className="miniPhone"><div className="miniAvatar" /><div className="miniLines"><i /><i /><i /></div></div>
        </div>
        <div className="floatingCard floatingCardTwo" aria-hidden="true">
          <span className="miniLabel">PRODUCT VELOCITY</span>
          <strong>Design → Build → Launch</strong>
          <div className="miniBars"><i/><i/><i/><i/></div>
        </div>
      </section>

      <section className="quoteStrip">
        <div className="shell quoteGrid">
          <p className="bigQuote">NetSwagger is a software development company that helps businesses and entrepreneurs transform ideas</p>
          <p className="quoteDetail">They successfully manage the diverse skills of their talented group to build technically challenging projects. <strong>— Bob Sutton</strong></p>
        </div>
      </section>

      <section className="section shell" id="services">
        <div className="sectionHead">
          <div>
            <p className="sectionKicker">Our core services</p>
            <h2>One partner from idea<br/>to launch.</h2>
          </div>
          <p>Our expertise spans mobile and web development, supported by intuitive UX/UI design. Every discipline works together, so the product feels considered—not assembled.</p>
        </div>

        <div className="servicesGrid">
          {services.map((service) => (
            <div key={service.title} className="serviceCard">
              <img className="serviceImage" src={service.image} alt={service.title} />
            </div>
          ))}
        </div>
      </section>

      <section className="recognition">
        <div className="shell recognitionGrid">
          <div className="recognitionIntro">
            <p className="sectionKicker">Recognized for excellence</p>
            <h2>Quality people notice.</h2>
            <p>Passion, transparency, thoughtful delivery, and communication that keeps clients close to the work.</p>
            <img className="stars" src="https://images.squarespace-cdn.com/content/v1/5c8bff92523958908c39db54/67cd4328-838c-420a-9e32-e2c67046d8d0/stars.png" alt="Five star rating" />
          </div>
          <div className="badges">
            <figure><img src="https://images.squarespace-cdn.com/content/v1/5c8bff92523958908c39db54/28fdd2f7-fa80-4a4b-b9c6-ab7c973e94dd/design%2BrushVerfifed%2BAgency%2BRound%2Bv3.png" alt="DesignRush Verified Agency 2024" /></figure>
            <figure><img src="https://images.squarespace-cdn.com/content/v1/5c8bff92523958908c39db54/35226680-4d2c-4e8e-afd7-e069c3b14c21/clutch.png" alt="Clutch Top App Development Company badge" /></figure>
            <figure><img src="https://images.squarespace-cdn.com/content/v1/5c8bff92523958908c39db54/4f5d355d-d48b-4f31-9ad6-8bd52d9d7074/appfutura-badge.png" alt="AppFutura Top Custom Software Development Company badge" /></figure>
          </div>
        </div>
      </section>

      <section className="workSection" id="work">
        <div className="shell">
          <div className="sectionHead lightHead">
            <div>
              <p className="sectionKicker">Featured portfolio</p>
              <h2>Work with a pulse.</h2>
            </div>
            <p>From dating and creator platforms to sports, music, ecommerce, and concept products, these featured projects preserve the portfolio lineup from the original NetSwagger site.</p>
          </div>

          <div className="workGrid">
            {work.map((item, index) => (
              <article className="workCard" key={item.name}>
                <img className="workImage" src={item.image} alt={`${item.name} mobile app`} />
                <div className="workMeta">
                  <span>{item.tag}</span><span>0{index + 1}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell" id="process">
        <div className="sectionHead">
          <div>
            <p className="sectionKicker">Our proven process</p>
            <h2>Clear steps.<br/>Better momentum.</h2>
          </div>
          <p>A focused five-step delivery model keeps decisions visible, quality high, and the team aligned from the first conversation through launch.</p>
        </div>

        <div className="processList">
          {process.map(([num, title, copy]) => (
            <article className="processRow" key={num}>
              <span className="processNum">{num}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span className="processArrow"><Arrow /></span>
            </article>
          ))}
        </div>
      </section>

      <section className="reviewsSection" id="reviews">
        <div className="shell">
          <div className="reviewTop">
            <div>
              <p className="sectionKicker">What our clients say</p>
              <h2>Trusted because the work<br/>feels collaborative.</h2>
            </div>
            <img className="reviewSnapshot" src="https://images.squarespace-cdn.com/content/v1/5c8bff92523958908c39db54/2a744934-45d4-46fe-a4ab-566b7ea0af49/Screenshot%2B2024-04-01%2Bat%2B11.03.54%2BAM.png" alt="Client review snapshot" />
          </div>
          <div className="testimonialsGrid">
            {testimonials.map((item) => (
              <article className="testimonialCard" key={item.author}>
                <div className="quoteMark">“</div>
                <p>{item.quote}</p>
                <footer>{item.author}</footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="insightSection">
        <div className="shell insightGrid">
          <div className="insightVisual" aria-hidden="true">
            <div className="insightPanel panelBack" />
            <div className="insightPanel panelFront">
              <span className="panelTag">THE RIGHT TEAM</span>
              <div className="panelLine panelLineLg"/><div className="panelLine"/><div className="panelLine panelLineSm"/>
              <div className="panelStats"><i/><i/><i/></div>
            </div>
          </div>
          <div className="insightCopy">
            <p className="sectionKicker">Helpful information</p>
            <h2>Finding the right development team changes the outcome.</h2>
            <p>The strongest teams combine technical depth with communication, collaboration, and the ability to adapt when a project changes. That mix creates better decisions, less friction, and software that is easier to keep improving after launch.</p>
            <p>NetSwagger brings developers, designers, and strategists together around one goal: deliver a solution that fits the real product need—not just the initial feature list.</p>
            <a className="textLink" href="https://www.netswagger.org/what-you-should-know" target="_blank" rel="noreferrer">Explore helpful information <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="contactSection" id="contact">
        <div className="shell contactCard">
          <div className="contactGlow" aria-hidden="true" />
          <div className="contactCopy">
            <p className="sectionKicker">Free consultation & estimate</p>
            <h2>Have a product in mind?<br/>Make it real.</h2>
            <p>Tell us what you&apos;re building, what needs to improve, or where the current product is stuck. We&apos;ll start with a focused conversation.</p>
          </div>
          <div className="contactActions">
            <a className="primaryButton primaryButtonLight" href="mailto:info@netswagger.org?subject=Free%20Consultation%20and%20Estimate">Start a conversation <Arrow /></a>
            <a className="contactLine" href="tel:+13362986469">336-298-6469</a>
            <a className="contactLine" href="mailto:info@netswagger.org">info@netswagger.org</a>
          </div>
        </div>
      </section>

      <footer className="siteFooter">
        <div className="shell footerGrid">
          <div>
            <a href="#top" className="brand footerBrand"><img className="brandLogo" src="/netswagger-logo.svg" alt="NetSwagger" /></a>
            <p className="footerBlurb">App, web, and product development with the care and momentum of an embedded team.</p>
          </div>
          <div>
            <h4>Services</h4>
            <span>Mobile App Development</span>
            <span>Web Development</span>
            <span>UX/UI Design</span>
          </div>
          <div>
            <h4>Company</h4>
            <span>Our Work</span>
            <span>Client Reviews</span>
            <span>Blog</span>
          </div>
          <div>
            <h4>Location</h4>
            <p>NetSwagger Enterprises LLC<br/>5762 Tomahawk Rd<br/>Winston-Salem, NC 27106</p>
          </div>
        </div>
        <div className="shell footerBottom"><span>© {new Date().getFullYear()} NetSwagger Enterprises LLC</span><a href="https://www.netswagger.org/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a></div>
      </footer>
    </main>
  );
}
