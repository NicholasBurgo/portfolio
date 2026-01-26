import { useEffect, useState } from "react";

export default function GlobalBackground() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleTransition = (event: CustomEvent) => {
      setIsTransitioning(event.detail.isTransitioning);
    };

    window.addEventListener('particleTransition', handleTransition as EventListener);

    return () => {
      window.removeEventListener('particleTransition', handleTransition as EventListener);
    };
  }, []);

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
        opacity: isTransitioning ? 0.4 : 0.8,
        transition: 'opacity 0.5s ease-in-out',
        pointerEvents: 'none',
      }}
    />
  );
}
