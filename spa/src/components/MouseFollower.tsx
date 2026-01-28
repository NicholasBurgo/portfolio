import { useEffect, useRef } from "react";

export default function MouseFollower() {
  const hideTimeoutRef = useRef<number | null>(null);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    const follower = document.getElementById("follower");
    if (!follower) return;

    const showFollower = (x: number, y: number) => {
      follower.style.left = `${x}px`;
      follower.style.top = `${y}px`;
      follower.style.opacity = "1";
      follower.style.transform = "translate(-50%, -50%) scale(1)";
    };

    const hideFollower = () => {
      follower.style.opacity = "0";
      follower.style.transform = "translate(-50%, -50%) scale(0)";
    };

    const clearHideTimeout = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };

    const startHideTimeout = () => {
      clearHideTimeout();
      hideTimeoutRef.current = window.setTimeout(() => {
        hideFollower();
      }, 500);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Ignore mouse events if we detected this is a touch device
      if (isTouchDevice.current) return;
      showFollower(e.clientX, e.clientY);
      clearHideTimeout();
    };

    const handleTouchStart = (e: TouchEvent) => {
      isTouchDevice.current = true;
      const touch = e.touches[0];
      if (touch) {
        showFollower(touch.clientX, touch.clientY);
      }
      clearHideTimeout();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        showFollower(touch.clientX, touch.clientY);
      }
      clearHideTimeout();
    };

    const handleTouchEnd = () => {
      startHideTimeout();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
      clearHideTimeout();
    };
  }, []);

  return <div id="follower"></div>;
}


