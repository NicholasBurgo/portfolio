import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { transitionState } from "../components/ParticleBackground";
import { getAllPosts } from "../data/blogPosts";
import { projectData } from "../lib/projectData";

export default function Home() {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const [nameLetters, setNameLetters] = useState<HTMLSpanElement[]>([]);
  const [subtitleReady, setSubtitleReady] = useState(false);
  const waveTextRef = useRef<HTMLDivElement>(null);

  const handleNavigation = (path: string) => {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      
      // Trigger collapse animation
      transitionState.setIsTransitioning(true);
      
      // Dispatch event to start collapse
      window.dispatchEvent(new CustomEvent('startCollapse', { detail: { targetPath: path } }));
      
      // Wait for collapse to complete, then navigate
      let checkCount = 0;
      const maxChecks = 300; // ~5 seconds max at 60fps
      const checkCollapse = () => {
        checkCount++;
        if (!transitionState.isTransitioning || checkCount >= maxChecks) {
          // Collapse complete or timeout, now navigate
          if (checkCount >= maxChecks) {
            // Force reset on timeout
            transitionState.setIsTransitioning(false);
          }
          navigate(path);
        } else {
          // Still collapsing, check again
          requestAnimationFrame(checkCollapse);
        }
      };
      
      // Start checking after a brief delay to let collapse start
      setTimeout(() => {
        requestAnimationFrame(checkCollapse);
      }, 50);
    };
  };

  const latestPosts = getAllPosts().slice(0, 3);
  const featuredProjects = projectData.slice(0, 3);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const phrases = [
    "COMPUTER SCIENCE STUDENT | FULL STACK DEVELOPER.",
    "READY TO INNOVATE.",
    "READY TO COLLABORATE.",
    "READY TO BUILD THE FUTURE.",
  ];

  useEffect(() => {
    // Initialize name
    const nameElement = nameRef.current;
    if (!nameElement) return;

    const fullName = "NICHOLAS BURGO";
    const letters: HTMLSpanElement[] = [];

    nameElement.innerHTML = "";
    const nameWrapper = document.createElement("div");
    nameWrapper.style.display = "inline-flex";
    nameWrapper.style.gap = "0";

    fullName.split("").forEach((char) => {
      const span = document.createElement("span");
      span.className = "text-4xl sm:text-5xl md:text-[5rem]";

      const letterSpan = document.createElement("span");
      if (char === " ") {
        letterSpan.innerHTML = "&nbsp;";
        letterSpan.classList.add("mx-2");
      } else {
        letterSpan.textContent = char;
      }

      letterSpan.style.display = "inline-block";
      letterSpan.style.transition = "transform 0.2s ease-out";

      span.appendChild(letterSpan);
      nameWrapper.appendChild(span);
      letters.push(letterSpan);
    });

    nameElement.appendChild(nameWrapper);
    setNameLetters(letters);

    // Glitch in animation
    setTimeout(() => {
      nameWrapper.classList.add("glitch-in");
      setTimeout(() => {
        setSubtitleReady(true);
      }, 400);
    }, 500);
  }, []);

  useEffect(() => {
    // Mouse-over effect for name
    if (nameLetters.length === 0) return;

    const handleMouseMove = (e: MouseEvent) => {
      nameLetters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const letterX = rect.left + rect.width / 2;
        const letterY = rect.top + rect.height / 2;

        const distX = e.clientX - letterX;
        const distY = e.clientY - letterY;
        const distance = Math.sqrt(distX ** 2 + distY ** 2);

        if (distance < 80) {
          const angle = Math.atan2(distY, distX);
          const offset = (80 - distance) / 3;
          letter.style.transform = `translate(${-Math.cos(angle) * offset}px, ${-Math.sin(angle) * offset}px)`;
        } else {
          letter.style.transform = "translate(0, 0)";
        }
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [nameLetters]);

  useEffect(() => {
    // Subtitle typing animation
    if (!subtitleReady || !subtitleRef.current) return;

    let currentPhraseIndex = 0;
    let letterElements: HTMLSpanElement[] = [];
    let lineWrapper: HTMLDivElement | null = null;

    const createLetterSpans = (text: string) => {
      if (!subtitleRef.current) return;

      subtitleRef.current.innerHTML = "";
      letterElements = [];

      lineWrapper = document.createElement("div");
      lineWrapper.style.display = "inline-flex";
      lineWrapper.style.gap = "0";

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement("span");

        if (char === " ") {
          span.innerHTML = "&nbsp;";
          span.classList.add("mx-1");
        } else {
          span.textContent = char;
        }

        span.style.display = "inline-block";
        span.style.transition = "transform 0.2s ease-out";
        lineWrapper.appendChild(span);
        letterElements.push(span);
      }

      subtitleRef.current.appendChild(lineWrapper);
    };

    const glitchInPhrase = () => {
      const currentPhrase = phrases[currentPhraseIndex];
      createLetterSpans(currentPhrase);

      if (lineWrapper) {
        lineWrapper.classList.add("glitch-in");

        setTimeout(() => {
          glitchOutPhrase();
        }, 3500);
      }
    };

    const glitchOutPhrase = () => {
      if (!lineWrapper) return;

      lineWrapper.classList.remove("glitch-in");
      lineWrapper.classList.add("glitch-out");

      setTimeout(() => {
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        glitchInPhrase();
      }, 300);
    };

    // Mouse-over effect for subtitle
    const handleSubtitleMouseMove = (e: MouseEvent) => {
      letterElements.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const letterX = rect.left + rect.width / 2;
        const letterY = rect.top + rect.height / 2;

        const distX = e.clientX - letterX;
        const distY = e.clientY - letterY;
        const distance = Math.sqrt(distX ** 2 + distY ** 2);

        if (distance < 80) {
          const angle = Math.atan2(distY, distX);
          const offset = (80 - distance) / 3;
          letter.style.transform = `translate(${-Math.cos(angle) * offset}px, ${-Math.sin(angle) * offset}px)`;
        } else {
          letter.style.transform = "translate(0, 0)";
        }
      });
    };

    document.addEventListener("mousemove", handleSubtitleMouseMove);

    setTimeout(glitchInPhrase, 500);

    return () => {
      document.removeEventListener("mousemove", handleSubtitleMouseMove);
    };
  }, [subtitleReady]);

  useEffect(() => {
    // Wave animation
    const triggerWave = () => {
      const wave = waveTextRef.current;
      if (!wave) return;

      wave.classList.remove("wave-animate");
      void wave.offsetWidth; // Trigger reflow
      wave.classList.add("wave-animate");
      setTimeout(triggerWave, 9500);
    };

    setTimeout(triggerWave, 6000);
  }, []);

  useEffect(() => {
    // Background activation
    const updateActiveBackground = () => {
      const section = document.querySelector(".home-bg");
      if (section) {
        section.classList.add("active");
      }
    };

    updateActiveBackground();
    window.addEventListener("scroll", updateActiveBackground);
    return () => window.removeEventListener("scroll", updateActiveBackground);
  }, []);

  return (
    <>
      <Helmet>
        <title>Nicholas Burgo</title>
        <meta name="description" content="Nicholas Burgo - Computer Science Student | Full Stack Developer" />
      </Helmet>
      <section
        id="home"
        className="section-bg home-bg min-h-screen flex flex-col items-center justify-between px-4 text-center pt-26 pb-8 relative"
      >
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <div className="animate-scale-in">
            <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white mb-14 whitespace-nowrap">
              <div id="name" ref={nameRef} className="flex justify-center gap-0"></div>
            </h2>
            <span className="mx-4"></span>
            <p className="mt-8 text-base sm:text-lg text-white/80 tracking-widest uppercase">
              <span
                id="typing-subtitle"
                ref={subtitleRef}
                className="subtitle flex justify-center gap-0"
              ></span>
            </p>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center w-full z-20">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              to="/blog"
              onClick={handleNavigation("/blog")}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
            >
              Read the Blog
            </Link>
            <Link
              to="/projects"
              onClick={handleNavigation("/projects")}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-filter backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:border-blue-300"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Latest from the Blog Section */}
      {latestPosts.length > 0 && (
        <section className="py-24 px-4 bg-gradient-to-b from-transparent to-[#0a0f1a]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                Latest from the Blog
              </h2>
              <Link
                to="/blog"
                onClick={handleNavigation("/blog")}
                className="text-blue-300 hover:text-blue-400 font-semibold transition-colors"
              >
                View all posts →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  onClick={handleNavigation(`/blog/${post.slug}`)}
                  className="blog-card block"
                >
                  <article className="project-card p-6 h-full flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2 hover:text-blue-300 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
                      <span>{formatDate(post.date)}</span>
                      <span>•</span>
                      <span>{post.readingTime}</span>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="tech-tag text-xs px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-white/70 text-sm mb-4 flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="text-blue-300 font-semibold text-sm">
                      Read →
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-24 px-4 bg-gradient-to-b from-[#0a0f1a] to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                Featured Projects
              </h2>
              <Link
                to="/projects"
                onClick={handleNavigation("/projects")}
                className="text-blue-300 hover:text-blue-400 font-semibold transition-colors"
              >
                View all projects →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <div key={project.title} className="project-card p-6">
                  {project.thumbnail && (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tech.slice(0, 3).map((tech) => (
                      <span key={tech} className="tech-tag text-xs px-2 py-1">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/70 text-sm mb-4 line-clamp-3">
                    {project.desc}
                  </p>
                  <Link
                    to="/projects"
                    onClick={handleNavigation("/projects")}
                    className="text-blue-300 font-semibold text-sm hover:text-blue-400 transition-colors"
                  >
                    Learn more →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

