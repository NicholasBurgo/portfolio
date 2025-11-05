import { ReactNode, useEffect, useState } from "react";

interface RouteTransitionProps {
  children: ReactNode;
}

export default function RouteTransition({ children }: RouteTransitionProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleTransition = (event: CustomEvent) => {
      const { isTransitioning } = event.detail;
      if (isTransitioning) {
        // Hide content when transition starts
        setIsVisible(false);
      } else {
        // Show content after transition completes (with slight delay for explosion)
        setTimeout(() => {
          setIsVisible(true);
        }, 300);
      }
    };

    window.addEventListener('particleTransition', handleTransition as EventListener);

    return () => {
      window.removeEventListener('particleTransition', handleTransition as EventListener);
    };
  }, []);

  return (
    <div 
      className="route-transition"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      {children}
    </div>
  );
}


