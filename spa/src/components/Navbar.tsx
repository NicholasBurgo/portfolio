import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { transitionState } from "./ParticleBackground";

interface MagneticLinkProps {
  to: string;
  text: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  isActive: boolean;
}

const MagneticLink = ({ to, text, onClick, isActive }: MagneticLinkProps) => {
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [letters, setLetters] = useState<string[]>([]);

  useEffect(() => {
    setLetters(text.split(""));
  }, [text]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lettersRef.current.forEach((letter) => {
        if (!letter) return;
        const rect = letter.getBoundingClientRect();
        const letterX = rect.left + rect.width / 2;
        const letterY = rect.top + rect.height / 2;

        const distX = e.clientX - letterX;
        const distY = e.clientY - letterY;
        const distance = Math.sqrt(distX ** 2 + distY ** 2);

        if (distance < 40) {
          const angle = Math.atan2(distY, distX);
          const offset = (40 - distance) / 5;
          letter.style.transform = `translate(${-Math.cos(angle) * offset}px, ${-Math.sin(angle) * offset}px)`;
        } else {
          letter.style.transform = "translate(0, 0)";
        }
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative inline-flex px-2 py-1 transition-colors duration-300 ${isActive ? "text-blue-300" : "text-white/90 hover:text-blue-300"
        }`}
    >
      {letters.map((char, index) => (
        <span
          key={index}
          ref={(el) => (lettersRef.current[index] = el)}
          className="inline-block transition-transform duration-75 ease-out"
          style={{ willChange: "transform" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Link>
  );
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    const isSpherePage = location.pathname === "/" || location.pathname === "/project-test";
    const isTargetSpherePage = path === "/" || path === "/project-test";

    if (isSpherePage && !isTargetSpherePage) {
      e.preventDefault();
      transitionState.setIsTransitioning(true);
      window.dispatchEvent(new CustomEvent('startCollapse', { detail: { targetPath: path } }));

      let checkCount = 0;
      const maxChecks = 300;
      const checkCollapse = () => {
        checkCount++;
        if (!transitionState.isTransitioning || checkCount >= maxChecks) {
          if (checkCount >= maxChecks) transitionState.setIsTransitioning(false);
          navigate(path);
        } else {
          requestAnimationFrame(checkCollapse);
        }
      };

      setTimeout(() => requestAnimationFrame(checkCollapse), 50);
    }
  };

  return (
    <header className="fixed bottom-8 left-0 w-full z-50 px-6 py-4 flex items-center justify-center pointer-events-none">
      <nav className="flex items-center justify-center gap-4 text-xl font-bold pointer-events-auto">
        {location.pathname !== "/" && (
          <>
            <MagneticLink
              to="/"
              text="Home"
              onClick={(e) => handleNavClick(e, "/")}
              isActive={isActive("/")}
            />
            <span className="text-white/40 select-none">*</span>
          </>
        )}
        <MagneticLink
          to="/projects"
          text="Projects"
          onClick={(e) => handleNavClick(e, "/projects")}
          isActive={isActive("/projects")}
        />
        <span className="text-white/40 select-none">*</span>
        <MagneticLink
          to="/about"
          text="About"
          onClick={(e) => handleNavClick(e, "/about")}
          isActive={isActive("/about")}
        />
        <span className="text-white/40 select-none">*</span>
        <MagneticLink
          to="/contact"
          text="Contact"
          onClick={(e) => handleNavClick(e, "/contact")}
          isActive={isActive("/contact")}
        />
        <span className="text-white/40 select-none">*</span>
        <MagneticLink
          to="/project-test"
          text="Test"
          onClick={(e) => handleNavClick(e, "/project-test")}
          isActive={isActive("/project-test")}
        />
      </nav>
    </header>
  );
}


