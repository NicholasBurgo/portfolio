import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";

export default function About() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Title letter hover animation
    const title = titleRef.current;
    if (!title) return;

    const letters = title.querySelectorAll("span");

    const handleMouseMove = (e: MouseEvent) => {
      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const letterX = rect.left + rect.width / 2;
        const letterY = rect.top + rect.height / 2;

        const distX = e.clientX - letterX;
        const distY = e.clientY - letterY;
        const distance = Math.sqrt(distX ** 2 + distY ** 2);

        if (distance < 80) {
          const angle = Math.atan2(distY, distX);
          const offset = (80 - distance) / 3;
          (letter as HTMLElement).style.transform = `translate(${-Math.cos(angle) * offset}px, ${-Math.sin(angle) * offset}px)`;
        } else {
          (letter as HTMLElement).style.transform = "translate(0, 0)";
        }
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    // Background activation
    const updateActiveBackground = () => {
      const section = document.querySelector(".about-bg");
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
        <title>About - Nicholas Burgo</title>
        <meta
          name="description"
          content="Learn about Nicholas Burgo, a Computer Science student at Southeastern Louisiana University with expertise in full-stack development and game development."
        />
      </Helmet>
      <section
        id="about"
        className="section-bg about-bg min-h-screen px-6 lg:px-12 pt-20 pb-16 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3
              id="about-title"
              ref={titleRef}
              className="text-5xl md:text-6xl font-black mb-4 text-white animate-fade-in-up"
            >
              <span>A</span>
              <span>b</span>
              <span>o</span>
              <span>u</span>
              <span>t</span>
              <span>&nbsp;</span>
              <span>M</span>
              <span>e</span>
            </h3>
          </div>

          <div className="max-w-4xl mx-auto mb-8">
            <div className="glass-card p-8 opacity-0 animate-scale-in">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <i className="fas fa-user text-blue-400 mr-3"></i>
                  About Me
                </h3>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                      <img
                        src={`${import.meta.env.BASE_URL}images/headshot-main.png`}
                        alt="Nicholas Burgo portrait"
                        className="w-32 h-32 object-cover rounded-full border-2 border-white/20"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-white/70 leading-relaxed">
                        I'm Nicholas Burgo, a senior Computer Science major at Southeastern
                        Louisiana University with a concentration in Data Science. I have
                        hands-on experience in software and game development across multiple
                        platforms, from building AI-powered web applications with FastAPI and
                        PostgreSQL to creating immersive Unity projects and Raspberry Pi
                        prototypes. My strengths lie in blending problem-solving with
                        creativity, whether that's developing multiplayer games, designing
                        intuitive user interfaces, or architecting scalable backend systems.
                        Alongside my academic work, I actively explore entrepreneurial projects
                        like mobile apps and social platforms, reflecting my passion for
                        innovation and building solutions that make an impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <i className="fas fa-graduation-cap text-blue-400 mr-3"></i>
                  Education
                </h3>
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-blue-300 mb-1">
                    B.S. Computer Science
                  </h4>
                  <p className="text-white/80 mb-1">Southeastern Louisiana University</p>
                  <p className="text-sm text-white/60">
                    Concentration: Data Science • Expected Graduation: Fall 2026
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <i className="fas fa-code text-blue-400 mr-3"></i>
                  Skills & Interests
                </h3>
                <div className="grid md:grid-cols-2 gap-4 bg-white/5 rounded-lg p-4">
                  <div>
                    <h4 className="text-sm font-medium text-white/90 mb-2">Programming</h4>
                    <p className="text-sm text-white/70">
                      Java, Python, JavaScript, HTML/CSS, SQL
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90 mb-2">Development</h4>
                    <p className="text-sm text-white/70">React, Unity, C#, Full-Stack Development</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90 mb-2">Data Science</h4>
                    <p className="text-sm text-white/70">
                      Data Analysis, Machine Learning, Statistics
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90 mb-2">Other</h4>
                    <p className="text-sm text-white/70">
                      Game Development, VR Development, Database Design
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <a
                  href={`${import.meta.env.BASE_URL}documents/NicholasBurgoResV6.pdf`}
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 font-medium group"
                >
                  <i className="fa-solid fa-file-arrow-down group-hover:animate-bounce"></i>
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


