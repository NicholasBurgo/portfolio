import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import ProjectModal from "../components/ProjectModal";
import ImageViewer from "../components/ImageViewer";
import { projectData, Project } from "../lib/projectData";

export default function Projects() {
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleProjects, setVisibleProjects] = useState(4);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageViewerSrc, setImageViewerSrc] = useState<string | null>(null);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [imageViewerList, setImageViewerList] = useState<string[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const filteredProjects =
    currentFilter === "all"
      ? projectData
      : projectData.filter((p) => p.category === currentFilter);

  useEffect(() => {
    const updateVisibleProjects = () => {
      if (window.innerWidth <= 480) {
        setVisibleProjects(1);
      } else if (window.innerWidth <= 768) {
        setVisibleProjects(2);
      } else if (window.innerWidth <= 1200) {
        setVisibleProjects(3);
      } else {
        setVisibleProjects(4);
      }
    };

    updateVisibleProjects();
    window.addEventListener("resize", updateVisibleProjects);
    return () => window.removeEventListener("resize", updateVisibleProjects);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [currentFilter]);

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
      const section = document.querySelector(".projects-bg");
      if (section) {
        section.classList.add("active");
      }
    };

    updateActiveBackground();
    window.addEventListener("scroll", updateActiveBackground);
    return () => window.removeEventListener("scroll", updateActiveBackground);
  }, []);


  const nextSlide = () => {
    const maxIndex = Math.max(0, filteredProjects.length - visibleProjects);
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      const maxIndex = Math.max(0, filteredProjects.length - visibleProjects);
      setCurrentIndex(maxIndex);
    }
  };

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const openImageViewer = (imageSrc: string, index: number, imageList: string[]) => {
    setImageViewerSrc(imageSrc);
    setImageViewerIndex(index);
    setImageViewerList(imageList);
    setIsImageViewerOpen(true);
  };

  const nextImage = () => {
    if (imageViewerIndex < imageViewerList.length - 1) {
      const newIndex = imageViewerIndex + 1;
      setImageViewerIndex(newIndex);
      setImageViewerSrc(imageViewerList[newIndex]);
    }
  };

  const prevImage = () => {
    if (imageViewerIndex > 0) {
      const newIndex = imageViewerIndex - 1;
      setImageViewerIndex(newIndex);
      setImageViewerSrc(imageViewerList[newIndex]);
    }
  };

  const maxIndex = Math.max(0, filteredProjects.length - visibleProjects);
  const showArrows = filteredProjects.length > visibleProjects;

  return (
    <>
      <Helmet>
        <title>Projects - Nicholas Burgo</title>
        <meta
          name="description"
          content="View Nicholas Burgo's portfolio projects including full-stack applications, game development, and database systems."
        />
      </Helmet>
      <section
        id="projects"
        className="section-bg projects-bg min-h-screen px-6 lg:px-12 pt-20 pb-16 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3
              id="projects-title"
              ref={titleRef}
              className="text-5xl md:text-6xl font-black mb-4 text-white animate-fade-in-up"
            >
              <span>M</span>
              <span>y</span>
              <span>&nbsp;</span>
              <span>P</span>
              <span>r</span>
              <span>o</span>
              <span>j</span>
              <span>e</span>
              <span>c</span>
              <span>t</span>
              <span>s</span>
            </h3>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-up animation-delay-600">
            <button
              className={`filter-btn ${currentFilter === "all" ? "active" : ""}`}
              onClick={() => setCurrentFilter("all")}
            >
              <i className="fas fa-th-large mr-2"></i>All Projects
            </button>
            <button
              className={`filter-btn ${currentFilter === "fullstack" ? "active" : ""}`}
              onClick={() => setCurrentFilter("fullstack")}
            >
              <i className="fas fa-code mr-2"></i>Full Stack
            </button>
            <button
              className={`filter-btn ${currentFilter === "gamedev" ? "active" : ""}`}
              onClick={() => setCurrentFilter("gamedev")}
            >
              <i className="fas fa-gamepad mr-2"></i>Game Dev
            </button>
            <button
              className={`filter-btn ${currentFilter === "database" ? "active" : ""}`}
              onClick={() => setCurrentFilter("database")}
            >
              <i className="fas fa-database mr-2"></i>Database
            </button>
            <button
              className={`filter-btn ${currentFilter === "frontend" ? "active" : ""}`}
              onClick={() => setCurrentFilter("frontend")}
            >
              <i className="fas fa-palette mr-2"></i>Frontend
            </button>
          </div>

          <div className="relative mt-4">
            {showArrows && (
              <>
                <button
                  id="carousel-prev"
                  className={`carousel-nav carousel-nav-left ${currentIndex === 0 ? "hidden" : ""}`}
                  onClick={prevSlide}
                  aria-label="Previous projects"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  id="carousel-next"
                  className={`carousel-nav carousel-nav-right ${currentIndex >= maxIndex ? "hidden" : ""}`}
                  onClick={nextSlide}
                  aria-label="Next projects"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}

            <div className="carousel-container">
              <div
                className="carousel-track"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleProjects)}%)`,
                }}
              >
                {filteredProjects.map((project, index) => (
                  <div
                    key={index}
                    onClick={() => openProjectModal(project)}
                    className="project-card p-6 rounded-3xl opacity-0 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-2xl mb-6 border border-white/20"
                        loading="lazy"
                        decoding="async"
                        fetchPriority={index < 4 ? "high" : "low"}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl mb-6 border border-white/20 flex items-center justify-center">
                        <i className="fas fa-code text-6xl text-blue-400"></i>
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-white mb-4 h-16 flex items-center">
                      {project.title}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed font-light">
                      {project.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeProjectModal}
        onImageClick={openImageViewer}
      />

      <ImageViewer
        imageSrc={imageViewerSrc}
        imageList={imageViewerList}
        currentIndex={imageViewerIndex}
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </>
  );
}

