import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function GlobalBackground() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "";

  useEffect(() => {
    const handleTransition = (event: CustomEvent) => {
      setIsTransitioning(event.detail.isTransitioning);
    };

    window.addEventListener('particleTransition', handleTransition as EventListener);

    return () => {
      window.removeEventListener('particleTransition', handleTransition as EventListener);
    };
  }, []);

  // Home page: full opacity (0.8), fades during transition (0.4)
  // Other pages: always faded (0.4)
  const getOpacity = () => {
    if (!isHomePage) return 0.4;
    return isTransitioning ? 0.4 : 0.8;
  };

  return (
    <div
      className="global-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url('${import.meta.env.BASE_URL}images/Galaxy.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -10,
        opacity: getOpacity(),
        transition: 'opacity 0.5s ease-in-out',
        pointerEvents: 'none',
      }}
    />
  );
}
