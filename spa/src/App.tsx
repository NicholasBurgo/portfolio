import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import RouteTransition from "./components/RouteTransition";
import MouseFollower from "./components/MouseFollower";
import ParticleBackground from "./components/ParticleBackground";

// Lazy load routes for code splitting
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
        // Prefetch route chunks
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
          <div className="min-h-screen flex items-center justify-center">
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

