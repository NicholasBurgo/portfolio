import { useEffect, useRef, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import ProjectModal from "../components/ProjectModal";
import ImageViewer from "../components/ImageViewer";
import { projectData, Project } from "../lib/projectData";

type SortOrder = "newest" | "oldest";

export default function Projects() {
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleProjects, setVisibleProjects] = useState(4);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageViewerSrc, setImageViewerSrc] = useState<string | null>(null);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [imageViewerList, setImageViewerList] = useState<string[]>([]);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Filter options for dropdown
  const filterOptions = [
    { value: "all", label: "All Projects" },
    { value: "fullstack", label: "Full Stack" },
    { value: "gamedev", label: "Game Dev" },
    { value: "database", label: "Database" },
    { value: "frontend", label: "Frontend" },
    { value: "AI", label: "AI" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAndSortedProjects = useMemo(() => {
    let filtered =
      currentFilter === "all"
        ? [...projectData]
        : projectData.filter((p) => p.category === currentFilter);

    // Sort by dateRange.end (null means ongoing, treat as most recent)
    filtered.sort((a, b) => {
      const dateA = a.dateRange.end || "9999-12"; // Ongoing projects sort as most recent
      const dateB = b.dateRange.end || "9999-12";
      if (sortOrder === "newest") {
        return dateB.localeCompare(dateA); // Newest first (descending)
      } else {
        return dateA.localeCompare(dateB); // Oldest first (ascending)
      }
    });

    return filtered;
  }, [currentFilter, sortOrder]);

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
  }, [currentFilter, sortOrder]);

  useEffect(() => {
    // Title letter hover animation
    const title = titleRef.current;
    if (!title) return;

    const letters = title.querySelectorAll("span");
    let resetTimeout: number | null = null;

    const updateLetters = (clientX: number, clientY: number) => {
      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const letterX = rect.left + rect.width / 2;
        const letterY = rect.top + rect.height / 2;

        const distX = clientX - letterX;
        const distY = clientY - letterY;
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

    const resetLetters = () => {
      letters.forEach((letter) => {
        (letter as HTMLElement).style.transform = "";
      });
    };

    const clearResetTimeout = () => {
      if (resetTimeout) {
        clearTimeout(resetTimeout);
        resetTimeout = null;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateLetters(e.clientX, e.clientY);
      clearResetTimeout();
    };

    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        updateLetters(touch.clientX, touch.clientY);
      }
      clearResetTimeout();
    };

    const handleTouchEnd = () => {
      // Reset letters after 500ms
      clearResetTimeout();
      resetTimeout = window.setTimeout(() => {
        resetLetters();
      }, 500);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchstart", handleTouch, { passive: true });
    document.addEventListener("touchmove", handleTouch, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchstart", handleTouch);
      document.removeEventListener("touchmove", handleTouch);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }
    };
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
    const maxIndex = Math.max(0, filteredAndSortedProjects.length - visibleProjects);
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
      const maxIndex = Math.max(0, filteredAndSortedProjects.length - visibleProjects);
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

  const maxIndex = Math.max(0, filteredAndSortedProjects.length - visibleProjects);
  const showArrows = filteredAndSortedProjects.length > visibleProjects;

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

          {/* Filter dropdowns for small devices */}
          <div className="lg:hidden flex flex-wrap justify-center gap-4 mb-6 animate-fade-in-up animation-delay-600 relative z-[100]">
            {/* Category Filter Dropdown */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => {
                  setFilterDropdownOpen(!filterDropdownOpen);
                  setSortDropdownOpen(false);
                }}
                className="filter-btn flex items-center gap-2"
              >
                {filterOptions.find(o => o.value === currentFilter)?.label}
                <i className={`fas fa-chevron-down text-xs transition-transform ${filterDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>
              {filterDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[160px] rounded-2xl overflow-hidden border border-blue-400/30 bg-[#0a0f1a]/95 backdrop-blur-lg shadow-xl z-[100]">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setCurrentFilter(option.value);
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left transition-all ${
                        currentFilter === option.value
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'text-white/90 hover:bg-blue-500/10 hover:text-blue-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => {
                  setSortDropdownOpen(!sortDropdownOpen);
                  setFilterDropdownOpen(false);
                }}
                className="filter-btn flex items-center gap-2"
              >
                {sortOptions.find(o => o.value === sortOrder)?.label}
                <i className={`fas fa-chevron-down text-xs transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>
              {sortDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[160px] rounded-2xl overflow-hidden border border-blue-400/30 bg-[#0a0f1a]/95 backdrop-blur-lg shadow-xl z-[100]">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortOrder(option.value as SortOrder);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left transition-all ${
                        sortOrder === option.value
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'text-white/90 hover:bg-blue-500/10 hover:text-blue-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter buttons for large devices */}
          <div className="hidden lg:flex flex-wrap justify-center gap-4 mb-6 animate-fade-in-up animation-delay-600">
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
            <button
              className={`filter-btn ${currentFilter === "AI" ? "active" : ""}`}
              onClick={() => setCurrentFilter("AI")}
            >
              <i className="fas fa-brain mr-2"></i>AI
            </button>
          </div>

          {/* Sort buttons for large devices */}
          <div className="hidden lg:flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-up animation-delay-800">
            <button
              className={`filter-btn ${sortOrder === "newest" ? "active" : ""}`}
              onClick={() => setSortOrder("newest")}
            >
              <i className="fas fa-sort-amount-down mr-2"></i>Newest First
            </button>
            <button
              className={`filter-btn ${sortOrder === "oldest" ? "active" : ""}`}
              onClick={() => setSortOrder("oldest")}
            >
              <i className="fas fa-sort-amount-up mr-2"></i>Oldest First
            </button>
          </div>

          <div className="relative mt-4">
            {/* Side arrows for large devices */}
            {showArrows && (
              <div className="hidden lg:block">
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
              </div>
            )}

            <div className="carousel-container">
              <div
                className="carousel-track"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleProjects)}%)`,
                }}
              >
                {filteredAndSortedProjects.map((project, index) => (
                  <div
                    key={project.id}
                    onClick={() => openProjectModal(project)}
                    className="project-card p-6 rounded-3xl opacity-0 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-4 h-16 flex items-center border-b border-transparent pb-4">
                      {project.title}
                    </h3>
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
                    <p className="text-white/90 text-sm leading-relaxed font-light">
                      {project.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom arrows for mobile */}
            {filteredAndSortedProjects.length > 1 && (
              <div className="lg:hidden flex justify-center items-center gap-6 mt-6">
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentIndex === 0
                      ? "bg-white/5 text-white/30 cursor-not-allowed"
                      : "bg-white/10 text-blue-400 border border-blue-400/30 hover:bg-blue-500/20 hover:border-blue-400/50"
                  }`}
                  aria-label="Previous project"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="text-white/70 text-sm">
                  {currentIndex + 1} / {filteredAndSortedProjects.length}
                </span>
                <button
                  onClick={nextSlide}
                  disabled={currentIndex >= maxIndex}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentIndex >= maxIndex
                      ? "bg-white/5 text-white/30 cursor-not-allowed"
                      : "bg-white/10 text-blue-400 border border-blue-400/30 hover:bg-blue-500/20 hover:border-blue-400/50"
                  }`}
                  aria-label="Next project"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
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

