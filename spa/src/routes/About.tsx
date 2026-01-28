import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";

const skillGroups = [
  {
    title: "Core Engineering",
    items: [
      "Backend API Design and Application Architecture",
      "Data Modeling and Relational Database Design",
      "Asynchronous Systems and State Management",
    ],
  },
  {
    title: "Backend and Web",
    items: [
      "Python, Java, JavaScript",
      "FastAPI, REST APIs, Authentication",
      "PostgreSQL, SQL",
      "HTML, CSS, Frontend Integration",
    ],
  },
  {
    title: "Data and Applied AI",
    items: [
      "Data Analysis and Feature Engineering",
      "Machine Learning Fundamentals",
      "Model Evaluation and Applied AI Integration",
      "Statistics for Data Driven Systems",
    ],
  },
  {
    title: "Interactive and Simulation Systems",
    items: [
      "Unity and C#",
      "Game and Simulation Architecture",
      "Performance Aware System Design",
      "Real Time Logic and Event Systems",
    ],
  },
];

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
          content="Nicholas Burgo — senior Computer Science student at Southeastern Louisiana University. Backend and systems engineering, FastAPI, PostgreSQL, applied AI, and Unity. Building real systems end to end."
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
                <div className="bg-white/5 rounded-lg p-4 overflow-hidden">
                  <img
                    src={`${import.meta.env.BASE_URL}images/headshot-main.png`}
                    alt="Nicholas Burgo portrait"
                    className="float-left w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full border-2 border-white/20 mr-4 mb-3 sm:mr-5 sm:mb-4"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="text-center md:text-left">
                    <p className="text-white/70 leading-relaxed mb-4">
                      I am Nicholas Burgo, a senior Computer Science student at Southeastern Louisiana University with a concentration in Data Science. I focus on building real systems end to end, not isolated features or class-only projects.
                    </p>
                    <p className="text-white/70 leading-relaxed mb-4">
                      My core strength is backend and systems engineering. I design and implement APIs, data models, and application architecture using tools like FastAPI, PostgreSQL, and modern web stacks. I also work heavily with applied AI and data driven systems, where the goal is practical decision making rather than academic demos.
                    </p>
                    <p className="text-white/70 leading-relaxed mb-4">
                      Alongside backend work, I build interactive and simulation based projects in Unity and other environments when the problem demands it. These projects have forced me to think carefully about performance, state management, and system boundaries, not just visuals or gameplay.
                    </p>
                    <p className="text-white/70 leading-relaxed">
                      I am most effective when solving problems that require structure, ownership, and technical depth. Outside of coursework, I consistently build independent projects with the intent to ship usable software and iterate on it, not to pad a resume. I am actively developing my skills toward backend, AI, and systems focused roles where engineering rigor actually matters.
                    </p>
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
                  Skills
                </h3>
                <div className="bg-white/5 rounded-xl p-4 md:p-5 border border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                    {skillGroups.map((group, index) => (
                      <div key={index}>
                        <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">{group.title}</h4>
                        <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
                          {group.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
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


