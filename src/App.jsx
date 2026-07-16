import { useEffect, useRef, useState } from "react";
import { experience, metrics, projects, skillGroups, socials, tickerItems } from "./data";
import { ArrowDown, ArrowUpRight, CodeIcon, DownloadIcon, Github, Linkedin, MenuIcon } from "./components/Icons";
import { NetworkCanvas, PipelineLab, ProjectVisual, Reveal, TiltCard, useMotionRegion } from "./components/Interactive";

const resumeUrl = `${import.meta.env.BASE_URL}Harish_Krishnan_Resume.pdf`;

const navItems = [
  ["home", "Home"],
  ["profile", "Profile"],
  ["experience", "Timeline"],
  ["work", "Work"],
  ["stack", "Stack"],
];

const filters = [
  ["all", "All experiments"],
  ["ml", "ML / AI"],
  ["data", "Data / systems"],
  ["web", "Web"],
];

const aboutTerminalLines = [
  [
    { text: "As a passionate tech enthusiast and developer, I have a solid grasp of " },
    { text: "Python", tone: "cyan" },
    { text: ", " },
    { text: "SQL", tone: "acid" },
    { text: " and " },
    { text: "Java", tone: "purple" },
    { text: "." },
  ],
  [
    { text: "My expertise extends to areas like " },
    { text: "Data Structures", tone: "bright" },
    { text: ", " },
    { text: "Algorithm Analysis", tone: "bright" },
    { text: ", " },
    { text: "Machine Learning", tone: "bright" },
    { text: ", " },
    { text: "Data Analytics", tone: "bright" },
    { text: ", " },
    { text: "Generative AI", tone: "bright" },
    { text: " and " },
    { text: "Data Engineering", tone: "bright" },
    { text: "." },
  ],
  [
    { text: "Collaborating with my teammates on various projects has enriched my knowledge, making me well-prepared for a rewarding journey in software development. 🚀" },
  ],
];

const aboutTerminalLineLengths = aboutTerminalLines.map((line) => line.reduce((total, segment) => total + segment.text.length, 0));
const aboutTerminalCharacterCount = aboutTerminalLineLengths.reduce((total, length) => total + length, 0);

function usePageSignals() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const progressBar = document.querySelector(".scroll-progress");
    const cursorGlow = document.querySelector(".cursor-glow");
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let scrollFrame = 0;
    let pointerFrame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const updateScrollProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressBar?.style.setProperty("--scroll-progress", String(progress));
      scrollFrame = 0;
    };

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollProgress);
    };

    const onPointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (pointerFrame) return;
      pointerFrame = window.requestAnimationFrame(() => {
        cursorGlow?.style.setProperty("--cursor-x", `${pointerX}px`);
        cursorGlow?.style.setProperty("--cursor-y", `${pointerY}px`);
        pointerFrame = 0;
      });
    };

    updateScrollProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (finePointer) window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(scrollFrame);
      window.cancelAnimationFrame(pointerFrame);
      window.removeEventListener("scroll", onScroll);
      if (finePointer) window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  useEffect(() => {
    const sections = navItems
      .map(([id]) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-32% 0px -58%", threshold: [0, 0.1, 0.3] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeSection;
}

function Header({ activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("menu-is-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Harish Krishnan, back to home">
        <span className="brand-mark">HK</span>
        <span className="brand-copy">AI + PLATFORMS</span>
      </a>

      <nav id="primary-navigation" className={menuOpen ? "nav-shell is-open" : "nav-shell"} aria-label="Primary navigation">
        <div className="nav-mobile-head">
          <span>INDEX / 05</span>
          <span>HARISH.K</span>
        </div>
        {navItems.map(([id, label], index) => (
          <a
            key={id}
            href={`#${id}`}
            className={activeSection === id ? "nav-link is-active" : "nav-link"}
            aria-current={activeSection === id ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {label}
          </a>
        ))}
        <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>
          LET&apos;S TALK <ArrowUpRight size={16} />
        </a>
      </nav>

      <button
        className="menu-toggle"
        type="button"
        onClick={() => setMenuOpen((current) => !current)}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
      >
        <MenuIcon open={menuOpen} />
      </button>
    </header>
  );
}

function SectionLabel({ number, children }) {
  return (
    <div className="section-label">
      <span>{number}</span>
      <span>{children}</span>
      <i />
    </div>
  );
}

function SignalTicker() {
  const [motionRef, motionActive] = useMotionRegion();
  const items = [...tickerItems, ...tickerItems];
  return (
    <div ref={motionRef} className={`ticker motion-region${motionActive ? " is-motion-active" : ""}`} aria-label={`Focus areas: ${tickerItems.join(", ")}`}>
      <div className="ticker-track" aria-hidden="true">
        {items.map((item, index) => (
          <span key={`${item}-${index}`}><i />{item}</span>
        ))}
      </div>
    </div>
  );
}

function TerminalTypedLine({ segments, visibleCharacters, showCursor }) {
  const renderSegments = (characterLimit) => {
    let remaining = characterLimit;

    return segments.map((segment, index) => {
      const visibleText = segment.text.slice(0, Math.max(0, Math.min(segment.text.length, remaining)));
      remaining = Math.max(0, remaining - segment.text.length);
      if (!visibleText) return null;

      if (segment.tone) {
        return <strong key={`${segment.text}-${index}`} className={`about-terminal__token about-terminal__token--${segment.tone}`}>{visibleText}</strong>;
      }

      return <span key={`${segment.text}-${index}`}>{visibleText}</span>;
    });
  };

  return (
    <p className="about-terminal__typed-line">
      <span className="about-terminal__line-sizer" aria-hidden="true">{renderSegments(Number.POSITIVE_INFINITY)}</span>
      <span className="about-terminal__typed-copy">
        {renderSegments(visibleCharacters)}
        {showCursor && <i className="about-terminal__typing-caret" aria-hidden="true" />}
      </span>
    </p>
  );
}

function AboutTerminal() {
  const bodyRef = useRef(null);
  const [typingStarted, setTypingStarted] = useState(false);
  const [typedCharacters, setTypedCharacters] = useState(0);
  const typingComplete = typedCharacters >= aboutTerminalCharacterCount;

  useEffect(() => {
    const element = bodyRef.current;
    if (!element) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      setTypedCharacters(aboutTerminalCharacterCount);
      setTypingStarted(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setTypingStarted(true);
        observer.unobserve(element);
      },
      { threshold: 0.24, rootMargin: "0px 0px -8%" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!typingStarted || typedCharacters >= aboutTerminalCharacterCount) return undefined;

    const startedAt = performance.now();
    let frame = 0;

    const typeNextCharacter = (now) => {
      const nextCount = Math.min(aboutTerminalCharacterCount, Math.floor((now - startedAt) / 16));
      setTypedCharacters(nextCount);
      if (nextCount < aboutTerminalCharacterCount) frame = requestAnimationFrame(typeNextCharacter);
    };

    frame = requestAnimationFrame(typeNextCharacter);
    return () => cancelAnimationFrame(frame);
  }, [typingStarted]);

  let consumedCharacters = 0;
  const activeLine = typingComplete
    ? -1
    : aboutTerminalLineLengths.findIndex((lineLength) => {
        consumedCharacters += lineLength;
        return typedCharacters < consumedCharacters;
      });
  consumedCharacters = 0;

  return (
    <Reveal className="about-terminal">
      <div className="terminal-bar about-terminal__bar">
        <div className="window-dots" aria-hidden="true"><span /><span /><span /></div>
        <span>about_harish.sh</span>
        <span>UTF-8</span>
      </div>

      <div className="about-terminal__body" ref={bodyRef}>
        <p className="about-terminal__command">
          <span>harish@portfolio</span>:<em>~</em>$ cat ./about.txt
        </p>

        <div className="about-terminal__output">
          {aboutTerminalLines.map((segments, index) => {
            const visibleCharacters = Math.max(0, Math.min(aboutTerminalLineLengths[index], typedCharacters - consumedCharacters));
            consumedCharacters += aboutTerminalLineLengths[index];

            return (
              <div className="about-terminal__line" key={index}>
                <span className="about-terminal__line-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <TerminalTypedLine segments={segments} visibleCharacters={visibleCharacters} showCursor={typingStarted && activeLine === index} />
              </div>
            );
          })}
        </div>

        <p className={`about-terminal__prompt${typingComplete ? " is-ready" : ""}`} aria-hidden="true">
          <span>harish@portfolio</span>:<em>~</em>$ <i />
        </p>
      </div>

      <div className={`about-terminal__status${typingStarted && !typingComplete ? " is-typing" : ""}`} aria-live="polite">
        <i /> {typingComplete ? "profile loaded · 0 errors" : typingStarted ? "streaming profile.txt..." : "waiting for reader..."}
      </div>
    </Reveal>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-rail hero-rail--top">
        <span>PORTFOLIO / 2026</span>
        <span className="hero-status"><i /> BUILDING AI + DATA PLATFORMS</span>
        <span>BENGALURU, IN · 12.97°N</span>
      </div>

      <div className="shell hero-content">
        <Reveal className="hero-copy">
          <div className="hero-kicker">
            <span>HELLO / I&apos;M</span>
            <span className="hero-kicker__arrow">→</span>
            <span className="hero-kicker__role">ENGINEERING INTELLIGENT SYSTEMS</span>
          </div>
          <h1 className="hero-title">
            <span className="hero-title__name">Harish<br />Krishnan<span>.</span></span>
            <span className="hero-title__role">AI &amp; Platforms Engineer</span>
          </h1>
          <p className="hero-intro">
            I design and build intelligent systems on reliable data foundations—where AI engineering, platform thinking, and production-scale data meet.
          </p>
          <div className="hero-actions">
            <a className="button button--primary" href="#work">
              Explore selected work <ArrowDown size={17} />
            </a>
            <a className="button button--resume" href={resumeUrl} download="Harish_Krishnan_Resume.pdf">
              Download résumé <DownloadIcon size={17} />
            </a>
            <a className="button button--ghost" href={socials.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="hero-footnote">
            <img src={`${import.meta.env.BASE_URL}harish-profile.jpg`} alt="Harish Krishnan" />
            <div>
              <span>CURRENTLY</span>
              <p>Software Engineer 1 <b>@ bigbasket</b></p>
            </div>
          </div>
        </Reveal>

        <Reveal className="hero-lab-wrap" delay={140}>
          <PipelineLab />
        </Reveal>
      </div>

      <div className="hero-rail hero-rail--bottom">
        <span className="scroll-hint"><i><ArrowDown size={14} /></i> SCROLL TO TRACE THE PIPELINE</span>
        <div className="hero-socials">
          <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a>
          <a href={socials.leetcode} target="_blank" rel="noreferrer" aria-label="LeetCode"><CodeIcon /></a>
        </div>
      </div>
    </section>
  );
}

function Profile() {
  return (
    <section className="section section--profile" id="profile">
      <div className="shell">
        <SectionLabel number="01">SYSTEM PROFILE</SectionLabel>

        <div className="profile-intro">
          <Reveal>
            <p className="eyebrow">THE THROUGH-LINE</p>
            <h2>I don&apos;t see data and ML as separate worlds.</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="profile-copy">
              <p>
                Good models begin long before <code>model.fit()</code>. They begin with dependable inputs, clear assumptions, and systems designed to survive reality.
              </p>
              <p>
                That is the perspective I bring from data engineering into machine learning: <span>pipeline discipline, research curiosity, and a bias toward useful outcomes.</span>
              </p>
            </div>
          </Reveal>
        </div>

        <div className="profile-dashboard">
          <Reveal className="terminal-card">
            <div className="terminal-bar">
              <div className="window-dots"><span /><span /><span /></div>
              <span>focus.py</span>
              <span>UTF-8</span>
            </div>
            <pre aria-label="Current focus as a Python object"><code>
              <span className="code-line"><span className="code-purple">harish</span>.<span className="code-blue">current_focus</span>()</span>
              <span className="code-line">{"{"}</span>
              <span className="code-line code-line--indent"><span className="code-green">&quot;input&quot;</span>: <span className="code-yellow">&quot;reliable data&quot;</span>,</span>
              <span className="code-line code-line--indent"><span className="code-green">&quot;transform&quot;</span>: <span className="code-yellow">&quot;learning systems&quot;</span>,</span>
              <span className="code-line code-line--indent"><span className="code-green">&quot;output&quot;</span>: <span className="code-yellow">&quot;useful intelligence&quot;</span></span>
              <span className="code-line">{"}"}</span>
            </code></pre>
            <div className="terminal-status"><i /> process completed with curiosity</div>
          </Reveal>

          <div className="metric-grid">
            {metrics.map((metric, index) => (
              <Reveal key={metric.label} className="metric-card" delay={index * 70}>
                <span className="metric-index">M{index + 1}</span>
                <strong>{metric.value}</strong>
                <p>{metric.label}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <AboutTerminal />
      </div>
    </section>
  );
}

function Experience() {
  const timelineRef = useRef(null);
  const timelineFrameRef = useRef(0);
  const timelinePointerYRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(timelineFrameRef.current), []);

  const moveTimelineGlow = (event) => {
    if (event.pointerType === "touch") return;
    timelinePointerYRef.current = event.clientY;
    if (timelineFrameRef.current) return;

    timelineFrameRef.current = requestAnimationFrame(() => {
      timelineFrameRef.current = 0;
      const timeline = timelineRef.current;
      const rail = timeline?.querySelector(".timeline-line");
      if (!timeline || !rail) return;

      const railRect = rail.getBoundingClientRect();
      const position = Math.min(railRect.height, Math.max(0, timelinePointerYRef.current - railRect.top));
      const progress = railRect.height > 0 ? position / railRect.height : 0;
      const hue = Math.round(82 + progress * 200);
      const accentHue = (hue + 34) % 360;

      timeline.style.setProperty("--timeline-glow-y", `${position}px`);
      timeline.style.setProperty("--timeline-glow-color", `hsl(${hue} 100% 70%)`);
      timeline.style.setProperty("--timeline-glow-accent", `hsl(${accentHue} 100% 70%)`);
      timeline.style.setProperty("--timeline-glow-opacity", "1");
    });
  };

  const hideTimelineGlow = () => {
    cancelAnimationFrame(timelineFrameRef.current);
    timelineFrameRef.current = 0;
    timelineRef.current?.style.setProperty("--timeline-glow-opacity", "0");
  };

  return (
    <section className="section section--experience" id="experience">
      <div className="shell">
        <SectionLabel number="02">THE PIPELINE SO FAR</SectionLabel>
        <Reveal className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">EXPERIENCE / EDUCATION</p>
            <h2>From systems,<br />toward intelligence.</h2>
          </div>
          <p>Each stop added a layer—from research and production data to AI systems and platform engineering.</p>
        </Reveal>

        <div className="timeline" ref={timelineRef} onPointerMove={moveTimelineGlow} onPointerLeave={hideTimelineGlow}>
          <div className="timeline-line" aria-hidden="true" />
          {experience.map((item, index) => (
            <Reveal className={item.active ? "timeline-row is-current" : "timeline-row"} key={item.id} delay={index * 80}>
              <div className="timeline-id"><span>{item.id}</span><i /></div>
              <div className="timeline-date">{item.date}</div>
              <div className="timeline-title">
                <h3>{item.role}</h3>
                <p>{item.place}</p>
              </div>
              <p className="timeline-copy">{item.copy}</p>
              <div className="tag-list">
                {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="publication-strip">
          <div className="publication-signal" aria-hidden="true">
            <span>ACM</span>
            <i /><i /><i /><i /><i />
          </div>
          <div className="publication-copy">
            <span>PEER-REVIEWED / APIT &apos;25</span>
            <h3>Detection of Mobile Malware (ANDROID) using ML and Hybrid Analysis</h3>
            <p>Published in the Proceedings of the 2025 7th Asia Pacific Information Technology Conference.</p>
          </div>
          <a href={socials.publication} target="_blank" rel="noreferrer" aria-label="Read the ACM paper">
            READ PAPER <ArrowUpRight />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Work() {
  const [filter, setFilter] = useState("all");
  const visibleProjects = filter === "all" ? projects : projects.filter((project) => project.category === filter);

  return (
    <section className="section section--work" id="work">
      <div className="shell">
        <SectionLabel number="03">SELECTED EXPERIMENTS</SectionLabel>
        <Reveal className="section-heading section-heading--work">
          <div>
            <p className="eyebrow">PROJECT LAB</p>
            <h2>Proof, not promises.</h2>
          </div>
          <p>A growing set of experiments across applied ML, security research, distributed data, and the web.</p>
        </Reveal>

        <div className="work-toolbar">
          <div className="filter-list" aria-label="Filter projects">
            {filters.map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={filter === value ? "is-active" : ""}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}<span>{value === "all" ? projects.length : projects.filter((project) => project.category === value).length}</span>
              </button>
            ))}
          </div>
          <a href={socials.github} target="_blank" rel="noreferrer" className="text-link">
            ALL REPOSITORIES <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="project-grid" key={filter}>
          {visibleProjects.map((project, index) => (
            <TiltCard key={project.id} className={project.featured && filter === "all" ? "project-card is-featured" : "project-card"}>
              <div className="project-card__topline">
                <span>{project.kicker}</span>
                <span>0{project.id}</span>
              </div>
              <ProjectVisual type={project.visual} />
              <div className="project-card__body">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tag-list">
                  {project.stack.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              {project.link ? (
                <a className="project-card__link" href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} on GitHub`}>
                  <span>VIEW SOURCE</span><i><ArrowUpRight /></i>
                </a>
              ) : (
                <div className="project-card__link project-card__link--archived" aria-label="Source repository is archived">
                  <span>SOURCE ARCHIVED</span><i>—</i>
                </div>
              )}
              <div className="card-glow" aria-hidden="true" />
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillOrbit() {
  const [motionRef, motionActive] = useMotionRegion();

  return (
    <div ref={motionRef} className={`skill-orbit motion-region${motionActive ? " is-motion-active" : ""}`} aria-label="Core skill constellation: data platforms and machine learning">
      <div className="skill-orbit__grid" aria-hidden="true" />
      <div className="skill-orbit__ring skill-orbit__ring--outer" aria-hidden="true">
        <span className="orbit-label orbit-label--python">TENSORFLOW</span>
        <span className="orbit-label orbit-label--spark">AIRFLOW</span>
        <span className="orbit-label orbit-label--kafka">AWS</span>
      </div>
      <div className="skill-orbit__ring skill-orbit__ring--inner" aria-hidden="true">
        <span className="orbit-label orbit-label--sql">DBT</span>
        <span className="orbit-label orbit-label--tf">SAGEMAKER</span>
      </div>
      <div className="skill-orbit__core">
        <span>DATA</span>
        <i>→</i>
        <strong>ML</strong>
      </div>
      <div className="skill-orbit__caption"><i /> CAPABILITY GRAPH / LIVE</div>
    </div>
  );
}

function Stack() {
  return (
    <section className="section section--stack" id="stack">
      <div className="shell">
        <SectionLabel number="04">CAPABILITY GRAPH</SectionLabel>
        <div className="stack-layout">
          <Reveal className="stack-heading">
            <p className="eyebrow">TOOLS ARE NODES. THINKING IS THE NETWORK.</p>
            <h2>A stack built across the whole learning loop.</h2>
            <p>From distributed ingestion to model behavior, I like understanding what happens between the layers—not only calling the final API.</p>
            <SkillOrbit />
          </Reveal>

          <div className="skill-groups">
            {skillGroups.map((group, index) => (
              <Reveal className="skill-group" key={group.label} delay={index * 100}>
                <span className="skill-group__label">{group.label}</span>
                <h3>{group.title}</h3>
                <div className={group.dense ? "skill-list skill-list--dense" : "skill-list"}>
                  {group.skills.map((skill, skillIndex) => (
                    <div key={skill}><span>{String(skillIndex + 1).padStart(2, "0")}</span>{skill}<i /></div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <SignalTicker />
    </section>
  );
}

function Contact() {
  return (
    <section className="section section--contact" id="contact">
      <div className="contact-grid" aria-hidden="true" />
      <div className="shell contact-content">
        <Reveal>
          <SectionLabel number="05">OPEN CHANNEL</SectionLabel>
          <p className="eyebrow">HAVE AN ML PROBLEM, A DATA PROBLEM, OR BOTH?</p>
          <h2>Let&apos;s build the bridge<br />between <em>data</em> and <strong>decisions.</strong></h2>
          <div className="contact-actions">
            <a className="contact-orb" href={socials.linkedin} target="_blank" rel="noreferrer">
              <span>START A<br />CONVERSATION</span>
              <ArrowUpRight size={28} />
            </a>
            <div className="contact-aside">
              <p>Best way to reach me</p>
              <a href={socials.linkedin} target="_blank" rel="noreferrer">LINKEDIN / HARISH KRISHNAN <ArrowUpRight size={15} /></a>
              <a href={resumeUrl} download="Harish_Krishnan_Resume.pdf">DOWNLOAD RÉSUMÉ <DownloadIcon size={15} /></a>
              <span>Bengaluru, India · IST (UTC +5:30)</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <a className="brand" href="#home" aria-label="Back to top"><span className="brand-mark">HK</span></a>
        <p>Designed as a living pipeline. Built by Harish Krishnan.</p>
        <div>
          <a href={socials.github} target="_blank" rel="noreferrer">GITHUB</a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer">LINKEDIN</a>
          <a href={socials.leetcode} target="_blank" rel="noreferrer">LEETCODE</a>
          <a href={resumeUrl} download="Harish_Krishnan_Resume.pdf">RÉSUMÉ</a>
        </div>
        <a className="back-top" href="#home">TOP <span>↑</span></a>
      </div>
    </footer>
  );
}

export default function App() {
  const activeSection = usePageSignals();

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="site-backdrop" aria-hidden="true">
        <NetworkCanvas />
        <div className="site-backdrop__grid" />
        <div className="site-backdrop__ambient site-backdrop__ambient--one" />
        <div className="site-backdrop__ambient site-backdrop__ambient--two" />
      </div>
      <div className="cursor-glow" aria-hidden="true" />
      <Header activeSection={activeSection} />
      <main id="main-content">
        <Hero />
        <SignalTicker />
        <Profile />
        <Experience />
        <Work />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
