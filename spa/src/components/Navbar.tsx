import { Link, useLocation, useNavigate } from "react-router-dom";
import { transitionState } from "./ParticleBackground";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // Only intercept if we're on home page and navigating away
    if (location.pathname === "/" && path !== "/") {
      e.preventDefault();
      
      // Trigger collapse animation
      transitionState.setIsTransitioning(true);
      
      // Dispatch event to start collapse
      window.dispatchEvent(new CustomEvent('startCollapse', { detail: { targetPath: path } }));
      
      // Wait for collapse to complete, then navigate
      const checkCollapse = () => {
        if (!transitionState.isTransitioning) {
          // Collapse complete, now navigate
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
    }
    // Otherwise let normal navigation happen
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-center">
      <nav className="flex items-center justify-center gap-8 text-md font-bold text-white/90 bg-white/10 backdrop-filter blur-20px border border-white/20 rounded-full px-8 py-3 shadow-xl min-w-[340px] w-auto max-w-2xl">
        <div className="flex gap-8">
          <Link
            to="/"
            onClick={(e) => handleNavClick(e, "/")}
            className={`transition-all duration-300 hover:scale-105 ${
              isActive("/") ? "text-blue-300 scale-105" : "hover:text-blue-300"
            }`}
            aria-current={isActive("/") ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            to="/projects"
            onClick={(e) => handleNavClick(e, "/projects")}
            className={`transition-all duration-300 hover:scale-105 ${
              isActive("/projects") ? "text-blue-300 scale-105" : "hover:text-blue-300"
            }`}
            aria-current={isActive("/projects") ? "page" : undefined}
          >
            Projects
          </Link>
          <Link
            to="/about"
            onClick={(e) => handleNavClick(e, "/about")}
            className={`transition-all duration-300 hover:scale-105 ${
              isActive("/about") ? "text-blue-300 scale-105" : "hover:text-blue-300"
            }`}
            aria-current={isActive("/about") ? "page" : undefined}
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={(e) => handleNavClick(e, "/contact")}
            className={`transition-all duration-300 hover:scale-105 ${
              isActive("/contact") ? "text-blue-300 scale-105" : "hover:text-blue-300"
            }`}
            aria-current={isActive("/contact") ? "page" : undefined}
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}


