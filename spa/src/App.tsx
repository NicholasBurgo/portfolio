import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import RouteTransition from "./components/RouteTransition";
import MouseFollower from "./components/MouseFollower";
import ParticleBackground from "./components/ParticleBackground";

// Lazy load routes for code splitting
// Vite's build wraps these with le() which uses Dt() to prepend base path
// However, relative imports resolve from current URL, so we need to ensure
// the base path is correctly used. The issue is that on /portfolio/projects,
// ./Projects.js resolves to /portfolio/projects/Projects.js instead of /portfolio/assets/Projects.js
const Home = lazy(() => import("./routes/Home"));
const About = lazy(() => import("./routes/About"));
const Projects = lazy(() => import("./routes/Projects"));
const Contact = lazy(() => import("./routes/Contact"));

// Prefetch routes on idle
function usePrefetchRoutes() {
  useEffect(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const prefetch = (path: string) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = path;
        document.head.appendChild(link);
      };

      const idleCallback = (window as any).requestIdleCallback || ((fn: () => void) => setTimeout(fn, 1));

      idleCallback(() => {
        // Prefetch route chunks (React Router handles basename)
        prefetch("/projects");
        prefetch("/about");
        prefetch("/contact");
      });
    }
  }, []);
}

function App() {
  usePrefetchRoutes();

  return (
    <>
      <ParticleBackground />
      <MouseFollower />
      <ScrollToTop />
      <Navbar />
      <RouteTransition>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0f1a] to-[#12161d]">
            <div className="text-white text-xl">Loading...</div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </RouteTransition>
    </>
  );
}

export default App;

