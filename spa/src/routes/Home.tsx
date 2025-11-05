import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { transitionState } from "../components/ParticleBackground";

export default function Home() {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const [nameLetters, setNameLetters] = useState<HTMLSpanElement[]>([]);
  const [subtitleReady, setSubtitleReady] = useState(false);
  const waveTextRef = useRef<HTMLDivElement>(null);

  const handleGoToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Trigger collapse animation
    transitionState.setIsTransitioning(true);
    
    // Dispatch event to start collapse
    window.dispatchEvent(new CustomEvent('startCollapse', { detail: { targetPath: '/projects' } }));
    
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
        navigate('/projects');
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
          <Link to="/projects" onClick={handleGoToProjects} className="relative flex flex-col items-center group go-to-projects-link">
            <span className="wave-text mb-2 text-white/80 text-lg tracking-widest z-10 transition-all duration-300 group-hover:scale-105 group-hover:text-blue-300" ref={waveTextRef}>
              <span>G</span>
              <span>o</span>
              <span>&nbsp;</span>
              <span>t</span>
              <span>o</span>
              <span>&nbsp;</span>
              <span>P</span>
              <span>r</span>
              <span>o</span>
              <span>j</span>
              <span>e</span>
              <span>c</span>
              <span>t</span>
              <span>s</span>
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}

