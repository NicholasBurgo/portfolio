import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

export default function Contact() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

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

        if (distance < 50) {
          const angle = Math.atan2(distY, distX);
          const offset = (50 - distance) / 5;
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
      const section = document.querySelector(".contact-bg");
      if (section) {
        section.classList.add("active");
      }
    };

    updateActiveBackground();
    window.addEventListener("scroll", updateActiveBackground);
    return () => window.removeEventListener("scroll", updateActiveBackground);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const copyEmailToClipboard = async () => {
    const email = "nicholas.burgo@selu.edu";

    try {
      await navigator.clipboard.writeText(email);
      setToast({ message: "Email copied to clipboard!", type: "success" });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = email;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) {
          setToast({ message: "Email copied to clipboard!", type: "success" });
        } else {
          setToast({ message: "Failed to copy email", type: "error" });
        }
      } catch (err) {
        setToast({ message: "Failed to copy email", type: "error" });
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact - Nicholas Burgo</title>
        <meta
          name="description"
          content="Get in touch with Nicholas Burgo for freelance projects, collaborations, or job opportunities."
        />
      </Helmet>
      <section
        id="contact"
        className="section-bg contact-bg min-h-screen px-6 lg:px-12 pt-20 pb-16 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3
              id="contact-title"
              ref={titleRef}
              className="text-5xl md:text-6xl font-black mb-4 text-white animate-scale-in"
            >
              <span>L</span>
              <span>e</span>
              <span>t</span>
              <span>'</span>
              <span>s</span>
              <span>&nbsp;</span>
              <span>W</span>
              <span>o</span>
              <span>r</span>
              <span>k</span>
              <span>&nbsp;</span>
              <span>T</span>
              <span>o</span>
              <span>g</span>
              <span>e</span>
              <span>t</span>
              <span>h</span>
              <span>e</span>
              <span>r</span>
            </h3>
          </div>

          <div className="flex justify-center">
            <div className="max-w-2xl w-full">
              <div className="glass-card p-8 animate-scale-in">
                <h4 className="text-3xl font-bold text-gradient mb-6 text-center">
                  Get In Touch
                </h4>
                <p className="text-white/90 text-lg leading-relaxed mb-8 font-light text-center">
                  I'm{" "}
                  <span className="text-blue-400 font-semibold">
                    open to freelance projects
                  </span>{" "}
                  and collaborations involving web apps, game development, data science, or job
                  opportunities.
                </p>

                <div className="space-y-6">
                  <div
                    onClick={copyEmailToClipboard}
                    className="contact-card p-6 flex items-center text-left group block cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-blue-600/20 rounded-full flex items-center justify-center mr-5 group-hover:from-blue-500/50 group-hover:to-blue-600/30 transition-all duration-300">
                      <i className="fas fa-envelope text-xl text-blue-400 icon-glow"></i>
                    </div>
                    <div>
                      <span className="text-white font-bold block text-lg">Email</span>
                      <span className="text-white/70 text-sm">nicholas.burgo@selu.edu</span>
                    </div>
                    <div className="ml-auto">
                      <i className="fas fa-copy text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    </div>
                  </div>

                  <a
                    href="https://www.linkedin.com/in/nicholas-burgo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-card p-6 flex items-center text-left group block"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-blue-600/20 rounded-full flex items-center justify-center mr-5 group-hover:from-blue-500/50 group-hover:to-blue-600/30 transition-all duration-300">
                      <i className="fab fa-linkedin text-xl text-blue-400 icon-glow"></i>
                    </div>
                    <div>
                      <span className="text-white font-bold block text-lg">LinkedIn</span>
                      <span className="text-white/70 text-sm">@nicholas-burgo</span>
                    </div>
                  </a>

                  <a
                    href="https://github.com/NicholasBurgo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-card p-6 flex items-center text-left group block"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500/30 to-purple-600/20 rounded-full flex items-center justify-center mr-5 group-hover:from-purple-500/50 group-hover:to-purple-600/30 transition-all duration-300">
                      <i className="fab fa-github text-xl text-purple-400 icon-glow"></i>
                    </div>
                    <div>
                      <span className="text-white font-bold block text-lg">GitHub</span>
                      <span className="text-white/70 text-sm">github.com/NicholasBurgo</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 backdrop-blur-xl ${
            toast.type === "success"
              ? "bg-green-500/20 text-white border border-green-400/30"
              : toast.type === "error"
              ? "bg-red-500/20 text-white border border-red-400/30"
              : "bg-blue-500/20 text-white border border-blue-400/30"
          }`}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-3 backdrop-blur-sm">
              <i
                className={`${
                  toast.type === "success"
                    ? "fas fa-check-circle"
                    : toast.type === "error"
                    ? "fas fa-exclamation-circle"
                    : "fas fa-info-circle"
                } text-sm`}
              ></i>
            </div>
            <span className="font-semibold text-white">{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
}


