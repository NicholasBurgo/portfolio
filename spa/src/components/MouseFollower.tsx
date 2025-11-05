import { useEffect } from "react";

export default function MouseFollower() {
  useEffect(() => {
    const follower = document.getElementById("follower");
    if (!follower) return;

    const handleMouseMove = (e: MouseEvent) => {
      follower.style.left = `${e.clientX}px`;
      follower.style.top = `${e.clientY}px`;
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <div id="follower"></div>;
}


