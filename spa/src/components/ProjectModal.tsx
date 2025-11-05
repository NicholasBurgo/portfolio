import { useEffect } from "react";

interface Project {
  title: string;
  tech: string[];
  desc: string;
  longDesc: string;
  images: string[];
  links: Array<{ type: string; url: string }>;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onImageClick?: (imageSrc: string, index: number, imageList: string[]) => void;
}

export default function ProjectModal({ project, isOpen, onClose, onImageClick }: ProjectModalProps) {
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

  const techHTML = project.tech
    .map((t) => `<span class="tech-tag">${t}</span>`)
    .join("");

  const linksHTML = project.links
    .map(
      (link) =>
        link.type === "github"
          ? `<a href="${link.url}" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center px-6 py-3 border-2 border-blue-400 text-blue-400 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105">
              <i class="fa-brands fa-github mr-3 text-lg"></i> View on GitHub
            </a>`
          : link.type === "demo"
          ? `<a href="${link.url}" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center px-6 py-3 border-2 border-green-400 text-green-400 rounded-full hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105">
              <i class="fa-solid fa-external-link-alt mr-3 text-lg"></i> Live Demo
            </a>`
          : ""
    )
    .join("");

  function extractSection(html: string, section: string) {
    const regex = new RegExp(`<b>${section}<\\/b>\\s*([^<]*)`, "i");
    const match = html.match(regex);
    return match ? match[1].trim() : "";
  }

  function extractFeatures(html: string) {
    const regex = /<b>Key Features:<\/b>([\s\S]*)/i;
    const match = html.match(regex);
    return match ? match[1].replace(/^\s*[:\-]?\s*/, "").trim() : "";
  }

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
        className="modal-glass rounded-3xl shadow-2xl max-w-4xl w-full mx-4 p-0 relative max-h-[90vh] overflow-y-auto modal-animate"
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
        <div id="project-modal-body" className="px-8 pt-12 pb-8">
          <div className="space-y-8">
            <div className="text-center pb-6 border-b border-white/20">
              <h3 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                {project.title}
              </h3>
              <div
                className="flex flex-wrap justify-center gap-3 mb-6"
                dangerouslySetInnerHTML={{ __html: techHTML }}
              />
              <p className="text-white/90 text-lg leading-relaxed max-w-3xl mx-auto">
                {project.desc}
              </p>
            </div>

            {project.images && project.images.length > 0 && (
              <div className="modal-gallery">
                {project.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${project.title} screenshot ${i + 1}`}
                    data-img-idx={i}
                    className="cursor-pointer"
                    onClick={() => {
                      if (onImageClick) {
                        onImageClick(img, i, project.images);
                      }
                    }}
                  />
                ))}
              </div>
            )}

            <div className="content-section space-y-6">
              <div className="grid gap-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <span className="font-bold text-blue-300 text-lg min-w-[120px] flex-shrink-0">
                    Role:
                  </span>
                  <span className="text-white/95 flex-1 leading-relaxed">
                    {extractSection(project.longDesc, "Role:")}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <span className="font-bold text-blue-300 text-lg min-w-[120px] flex-shrink-0">
                    Problem:
                  </span>
                  <span className="text-white/95 flex-1 leading-relaxed">
                    {extractSection(project.longDesc, "Problem:")}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <span className="font-bold text-blue-300 text-lg min-w-[120px] flex-shrink-0">
                    Solution:
                  </span>
                  <span className="text-white/95 flex-1 leading-relaxed">
                    {extractSection(project.longDesc, "Solution:")}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <span className="font-bold text-blue-300 text-lg min-w-[120px] flex-shrink-0">
                    Features:
                  </span>
                  <span className="text-white/95 flex-1 leading-relaxed">
                    {extractFeatures(project.longDesc)}
                  </span>
                </div>
              </div>
            </div>

            {linksHTML && (
              <div
                className="flex justify-center pt-6"
                dangerouslySetInnerHTML={{ __html: linksHTML }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

