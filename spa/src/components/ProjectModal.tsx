import { useEffect, useState } from "react";
import { Project, formatDateRange } from "../lib/projectData";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onImageClick?: (imageSrc: string, index: number, imageList: string[]) => void;
}

export default function ProjectModal({ project, isOpen, onClose, onImageClick }: ProjectModalProps) {
  const allImages = project ? project.images || [] : [];
  const hasCarousel = allImages.length > 1;
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    setCarouselIndex(0);
  }, [project?.id]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div
      id="project-modal-overlay"
      className={`fixed inset-0 modal-overlay z-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        id="project-modal-glass"
        className="modal-glass rounded-3xl max-w-4xl w-full mx-4 relative max-h-[90vh] flex flex-col overflow-hidden pt-6 pb-6 px-4 modal-animate"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="modal-close-btn"
          className="close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="px-4 pt-2 pb-6 border-b border-white/20 flex flex-col items-center justify-center">
          <h3 className="text-4xl font-extrabold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent text-center">
            {project.title}
          </h3>
          <p className="text-white/70 text-sm mt-2">
            {formatDateRange(project.dateRange.start, project.dateRange.end)}
          </p>
        </div>
        <div
          id="project-modal-scroll"
          className="project-modal-scroll flex-1 min-h-0 overflow-y-auto"
        >
          <div id="project-modal-body" className="px-4 pt-8 pb-8">
            <div className="space-y-8">
              {/* Project Images */}
              {allImages.length > 0 ? (
                <div className="relative w-full max-w-2xl mx-auto">
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/20">
                    <img
                      src={allImages[carouselIndex].src}
                      alt={allImages[carouselIndex].alt || `${project.title} screenshot ${carouselIndex + 1}`}
                      className="w-full max-h-80 object-contain cursor-pointer"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onClick={() => {
                        if (onImageClick) {
                          const imageSrcs = allImages.map(img => img.src);
                          onImageClick(
                            imageSrcs[carouselIndex],
                            carouselIndex,
                            imageSrcs
                          );
                        }
                      }}
                    />
                    {hasCarousel && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCarouselIndex((i) =>
                              i === 0 ? allImages.length - 1 : i - 1
                            );
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-[rgba(79,195,247,0.1)] text-[#4fc3f7] border border-[rgba(79,195,247,0.2)] hover:border-[rgba(79,195,247,0.4)] hover:text-white flex items-center justify-center transition-all z-10 backdrop-blur-[10px]"
                          aria-label="Previous image"
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCarouselIndex((i) =>
                              i === allImages.length - 1 ? 0 : i + 1
                            );
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-[rgba(79,195,247,0.1)] text-[#4fc3f7] border border-[rgba(79,195,247,0.2)] hover:border-[rgba(79,195,247,0.4)] hover:text-white flex items-center justify-center transition-all z-10 backdrop-blur-[10px]"
                          aria-label="Next image"
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                          {allImages.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCarouselIndex(i);
                              }}
                              className={`h-2 rounded-full transition-all ${
                                i === carouselIndex
                                  ? "w-6 bg-[#4fc3f7]"
                                  : "w-2 bg-[rgba(79,195,247,0.4)] hover:bg-[rgba(79,195,247,0.6)]"
                              }`}
                              aria-label={`Go to image ${i + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative w-full max-w-2xl mx-auto">
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-br from-blue-500/10 to-purple-600/10 flex items-center justify-center h-48">
                    <div className="text-center">
                      <i className="fas fa-database text-5xl text-blue-400/60 mb-3"></i>
                      <p className="text-white/50 text-sm">{project.title}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 1: Summary */}
              <div className="content-section">
                <h4 className="font-bold text-blue-300 text-xl mb-3">Summary</h4>
                <p className="text-white/90 text-lg leading-relaxed">
                  {project.summary}
                </p>
              </div>

              {/* Section 2: Engineering Highlights */}
              <div className="content-section">
                <h4 className="font-bold text-blue-300 text-xl mb-3">Engineering Highlights</h4>
                <ul className="space-y-2">
                  {project.highlights.map((highlight, index) => (
                    <li key={index} className="text-white/90 leading-relaxed flex items-start">
                      <span className="text-blue-400 mr-3 mt-1">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 3: Ownership */}
              <div className="content-section">
                <h4 className="font-bold text-blue-300 text-xl mb-3">Ownership</h4>
                <div className="space-y-3">
                  <div className="flex flex-col gap-3">
                    <span className="font-semibold text-blue-300">
                      Role:
                    </span>
                    <span className="text-white/95 leading-relaxed">
                      {project.ownership.role}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="font-semibold text-blue-300">
                      Responsibilities:
                    </span>
                    <ul className="text-white/95 space-y-1">
                      {project.ownership.responsibilities.map((resp, index) => (
                        <li key={index} className="leading-relaxed flex items-start">
                          <span className="text-blue-400 mr-2 mt-1">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 4: Tech Stack */}
              <div className="content-section">
                <h4 className="font-bold text-blue-300 text-xl mb-3">Tech Stack</h4>
                <div className="flex flex-wrap gap-3">
                  {project.tech.map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap justify-center gap-4 pt-6">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border-2 border-blue-400 text-blue-400 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <i className="fa-brands fa-github mr-3 text-lg"></i>
                    View on GitHub
                  </a>
                )}
                {project.links.linkedin && (
                  <a
                    href={project.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border-2 border-[#0077b5] text-[#0077b5] rounded-full hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <i className="fa-brands fa-linkedin mr-3 text-lg"></i>
                    View on LinkedIn
                  </a>
                )}
                {project.links.liveDemo && (
                  <a
                    href={project.links.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border-2 border-green-400 text-green-400 rounded-full hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <i className="fa-solid fa-external-link-alt mr-3 text-lg"></i>
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

