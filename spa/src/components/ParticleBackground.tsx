import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Export transition state for RouteTransition to use
export const transitionState = {
  isTransitioning: false,
  setIsTransitioning: (val: boolean) => {
    transitionState.isTransitioning = val;
    // Trigger custom event for RouteTransition
    window.dispatchEvent(new CustomEvent('particleTransition', { detail: { isTransitioning: val } }));
  }
};

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();
  const prevLocationRef = useRef<string>(location.pathname);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);
  const codeBubblesRef = useRef<any[]>([]);
  const transitionPhaseRef = useRef<'none' | 'collapsing' | 'exploding'>('none');
  const transitionProgressRef = useRef<number>(0);
  const delayedExplosionFrameRef = useRef<number | null>(null);
  const directionChangeTimeoutRef = useRef<number | null>(null);
  const postExplosionTimeRef = useRef<number>(-1); // -1 means disabled, 0-59 means active

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let cx = width / 2;
    let cy = height / 2;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      cx = width / 2;
      cy = height / 2;
    };

    resize();
    window.addEventListener("resize", resize);

    // Listen for collapse start event (from Navbar)
    const handleStartCollapse = (_event: CustomEvent) => {
      if (location.pathname === "/" && transitionPhaseRef.current === 'none') {
        transitionState.setIsTransitioning(true);
        transitionPhaseRef.current = 'collapsing';
        transitionProgressRef.current = 0;
        // Preserve current particles for transition
        particlesRef.current = [...particlesRef.current];
        codeBubblesRef.current = [...codeBubblesRef.current];
      }
    };

    window.addEventListener('startCollapse', handleStartCollapse as EventListener);

    const isHomePage = location.pathname === "/";
    const wasHomePage = prevLocationRef.current === "/";
    const transitioningFromHome = wasHomePage && !isHomePage;

    // Start transition if coming from home page (fallback for direct navigation)
    if (transitioningFromHome && transitionPhaseRef.current === 'none') {
      transitionState.setIsTransitioning(true);
      transitionPhaseRef.current = 'collapsing';
      transitionProgressRef.current = 0;
      // Preserve current particles for transition
      particlesRef.current = [...particlesRef.current];
      codeBubblesRef.current = [...codeBubblesRef.current];
    }

    // Update previous location after checking
    prevLocationRef.current = location.pathname;

    // Gravity well properties (home page only)
    const gravityWell = {
      x: cx,
      y: cy,
      radiusX: 350,
      radiusY: 70,
      strength: 0.01,
      eventHorizonX: 350,
      eventHorizonY: 70,
    };

    const PARTICLE_COUNT = isHomePage ? 120 : 43;
    const CODE_BUBBLE_COUNT = isHomePage ? 8 : 0;
    const codeSymbols = ["()", "{}", "[]", "<>"];
    const codeTechs = [
      "React",
      "FastAPI",
      "PostgreSQL",
      "C#",
      "Unity",
      "Blender",
      "Lua",
      "HTML",
      "CSS",
      "JavaScript",
      "SQL",
    ];

    function randomBetween(a: number, b: number) {
      return a + Math.random() * (b - a);
    }

    function resetCodeBubble(bubble: any, index: number) {
      if (!isHomePage) return;

      const totalBubbles = CODE_BUBBLE_COUNT;
      const angleStep = (2 * Math.PI) / totalBubbles;
      const angle = angleStep * index + Math.random() * angleStep * 0.3;

      const spawnDistance = Math.max(width, height) * (0.45 + Math.random() * 0.1);

      bubble.x = Math.cos(angle) * spawnDistance;
      bubble.y = Math.sin(angle) * spawnDistance;
      bubble.z = randomBetween(0.8, 1.2);

      const useSymbol = Math.random() < 0.4;
      bubble.text = useSymbol
        ? codeSymbols[Math.floor(Math.random() * codeSymbols.length)]
        : codeTechs[Math.floor(Math.random() * codeTechs.length)];

      bubble.size = randomBetween(25, 32);
      bubble.opacity = randomBetween(0.25, 0.45);

      const speed = randomBetween(0.3, 0.6);
      const angleToCenter = Math.atan2(-bubble.y, -bubble.x);
      const tangentialAngle = angleToCenter + Math.PI / 2;

      bubble.vx =
        Math.cos(angleToCenter) * speed * 0.35 +
        Math.cos(tangentialAngle) * speed * 0.65;
      bubble.vy =
        Math.sin(angleToCenter) * speed * 0.35 +
        Math.sin(tangentialAngle) * speed * 0.65;
    }

    function resetParticle(p: any) {
      if (isHomePage) {
        // Spawn particles from all four sides for constant stream
        const spawnSide = Math.floor(Math.random() * 4);

        let spawnX, spawnY;

        if (spawnSide === 0) {
          spawnX = -(width * 0.45 + Math.random() * width * 0.1);
          spawnY = (Math.random() - 0.5) * height * 0.6;
        } else if (spawnSide === 1) {
          spawnX = width * 0.45 + Math.random() * width * 0.1;
          spawnY = (Math.random() - 0.5) * height * 0.6;
        } else if (spawnSide === 2) {
          spawnX = (Math.random() - 0.5) * width * 0.6;
          spawnY = -(height * 0.45 + Math.random() * height * 0.1);
        } else {
          spawnX = (Math.random() - 0.5) * width * 0.6;
          spawnY = height * 0.45 + Math.random() * height * 0.1;
        }

        p.x = spawnX;
        p.y = spawnY;
      } else {
        // Simple particle system for other pages
        const angle = randomBetween(0, 2 * Math.PI);
        const radius = randomBetween(0, Math.min(width, height) * 0.7);
        p.x = Math.cos(angle) * radius;
        p.y = Math.sin(angle) * radius;
      }

      p.z = randomBetween(0.5, 1.5);
      p.size = randomBetween(0.5, 1.5);
      p.opacity = randomBetween(0.3, 0.8);
      p.speed = randomBetween(0.0002, 0.0008);
      p.twinkle = randomBetween(0, 1);
      p.twinkleSpeed = randomBetween(0.01, 0.04);

      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        p.color = "#4fc3f7";
      } else if (colorChoice < 0.7) {
        p.color = "#ffffff";
      } else if (colorChoice < 0.85) {
        p.color = "#81d4fa";
      } else {
        p.color = "#b3e5fc";
      }

      if (isHomePage) {
        const speed = randomBetween(0.3, 0.6);
        const angleToCenter = Math.atan2(-p.y, -p.x);
        const tangentialAngle = angleToCenter + Math.PI / 2;

        p.vx =
          Math.cos(angleToCenter) * speed * 0.35 +
          Math.cos(tangentialAngle) * speed * 0.65;
        p.vy =
          Math.sin(angleToCenter) * speed * 0.35 +
          Math.sin(tangentialAngle) * speed * 0.65;
      }
    }

    // Initialize particles
    let particles: any[] = [];
    // Only reinitialize if not in transition (to preserve particles during animation)
    if (transitionPhaseRef.current === 'none' && !transitioningFromHome) {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p: any = {};
        resetParticle(p);

        if (isHomePage && i < PARTICLE_COUNT * 0.6) {
          const progress = 0.2 + Math.random() * 0.6;
          p.x *= 1 - progress * 0.7;
          p.y *= 1 - progress * 0.7;

          // Ensure velocities are valid
          if (typeof p.vx !== 'number' || isNaN(p.vx) || !isFinite(p.vx)) {
            p.vx = 0;
          }
          if (typeof p.vy !== 'number' || isNaN(p.vy) || !isFinite(p.vy)) {
            p.vy = 0;
          }

          const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 0.5;
          const angleToCenter = Math.atan2(-p.y, -p.x);
          const tangentialAngle = angleToCenter + Math.PI / 2;

          const newVx =
            Math.cos(angleToCenter) * currentSpeed * 0.35 +
            Math.cos(tangentialAngle) * currentSpeed * 0.65;
          const newVy =
            Math.sin(angleToCenter) * currentSpeed * 0.35 +
            Math.sin(tangentialAngle) * currentSpeed * 0.65;

          // Validate before assigning
          if (isFinite(newVx) && isFinite(newVy)) {
            p.vx = newVx;
            p.vy = newVy;
          } else {
            // Fallback: reset particle if calculation fails
            resetParticle(p);
          }
        }

        particles.push(p);
      }
      particlesRef.current = particles;
    } else {
      // During transition, keep existing particles
      particles = particlesRef.current.length > 0 ? [...particlesRef.current] : [];
    }

    // Initialize code bubbles (home page only)
    let codeBubbles: any[] = [];
    // Only reinitialize if not in transition
    if (transitionPhaseRef.current === 'none' && !transitioningFromHome) {
      codeBubbles = [];
      if (isHomePage) {
        for (let i = 0; i < CODE_BUBBLE_COUNT; i++) {
          const bubble: any = {};
          resetCodeBubble(bubble, i);

          if (i < CODE_BUBBLE_COUNT * 0.5) {
            const progress = 0.3 + Math.random() * 0.5;
            bubble.x *= 1 - progress * 0.6;
            bubble.y *= 1 - progress * 0.6;

            const currentSpeed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy);
            const angleToCenter = Math.atan2(-bubble.y, -bubble.x);
            const tangentialAngle = angleToCenter + Math.PI / 2;

            bubble.vx =
              Math.cos(angleToCenter) * currentSpeed * 0.35 +
              Math.cos(tangentialAngle) * currentSpeed * 0.65;
            bubble.vy =
              Math.sin(angleToCenter) * currentSpeed * 0.35 +
              Math.sin(tangentialAngle) * currentSpeed * 0.65;
          }

          codeBubbles.push(bubble);
        }
      }
      codeBubblesRef.current = codeBubbles;
    } else {
      // During transition, keep existing bubbles
      codeBubbles = codeBubblesRef.current.length > 0 ? [...codeBubblesRef.current] : [];
    }

    function isPointInOval(px: number, py: number, ox: number, oy: number, rx: number, ry: number) {
      const dx = px - ox;
      const dy = py - oy;
      return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
    }

    function applyGravityWell(p: any): boolean {
      if (!isHomePage && transitionPhaseRef.current === 'none') return true;

      gravityWell.x = cx;
      gravityWell.y = cy;

      const screenX = cx + p.x;
      const screenY = cy + p.y;

      const dx = gravityWell.x - screenX;
      const dy = gravityWell.y - screenY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const maxDistance = Math.max(width, height) * 0.6;

      // Collapsing phase: intensify gravity well to spiral everything in
      if (transitionPhaseRef.current === 'collapsing') {
        // Calculate distance from center (particle coordinates, not screen)
        const particleDistance = Math.sqrt(p.x * p.x + p.y * p.y);
        
        // If already very close to center, mark as collapsed and stop movement
        if (particleDistance < 30) {
          p.x = 0;
          p.y = 0;
          p.vx = 0;
          p.vy = 0;
          p.collapsed = true;
          return true;
        }

        // Ensure velocities are valid numbers
        if (typeof p.vx !== 'number' || isNaN(p.vx) || !isFinite(p.vx)) {
          p.vx = 0;
        }
        if (typeof p.vy !== 'number' || isNaN(p.vy) || !isFinite(p.vy)) {
          p.vy = 0;
        }

        // Enhanced gravity well with spiral motion - gentler pull (dialed back by 2)
        const collapseStrength = 1.0 + transitionProgressRef.current * 2; // Reduced from 4 to 2
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 0.5; // Fallback speed
        const angleToBlackHole = Math.atan2(dy, dx);
        const tangentialAngle = angleToBlackHole + Math.PI / 2;
        
        // Spiral motion: balance between inward pull and tangential motion
        // More gradual change - gentler spiral collapse
        const spiralInward = 0.5 + transitionProgressRef.current * 0.15; // Reduced from 0.3 to 0.15 (0.5 -> 0.65)
        const spiralTangential = 1.0 - spiralInward; // 0.5 -> 0.35 (more tangential preserved)
        
        // Calculate target velocity with spiral (less speed enhancement)
        const enhancedSpeed = currentSpeed * (1.0 + collapseStrength * 0.15); // Reduced from 0.3 to 0.15
        const targetVx =
          Math.cos(angleToBlackHole) * enhancedSpeed * spiralInward +
          Math.cos(tangentialAngle) * enhancedSpeed * spiralTangential;
        const targetVy =
          Math.sin(angleToBlackHole) * enhancedSpeed * spiralInward +
          Math.sin(tangentialAngle) * enhancedSpeed * spiralTangential;

        // Validate target velocities
        if (isNaN(targetVx) || !isFinite(targetVx) || isNaN(targetVy) || !isFinite(targetVy)) {
          resetParticle(p);
          return false;
        }

        // Gentler interpolation toward target velocity (more gradual change)
        p.vx = p.vx * 0.85 + targetVx * 0.15; // Changed from 0.7/0.3 to 0.85/0.15
        p.vy = p.vy * 0.85 + targetVy * 0.15;

        // Reduced direct acceleration toward center
        const acceleration = collapseStrength * 0.1; // Reduced from 0.2 to 0.1
        p.vx += Math.cos(angleToBlackHole) * acceleration;
        p.vy += Math.sin(angleToBlackHole) * acceleration;

        // Final validation
        if (isNaN(p.vx) || !isFinite(p.vx) || isNaN(p.vy) || !isFinite(p.vy)) {
          resetParticle(p);
          return false;
        }

        return true;
      }

      // Exploding phase: particles explode outward (slower, less aggressive)
      if (transitionPhaseRef.current === 'exploding') {
        if (p.collapsed) {
          // Explode outward in random direction with much slower speed
          const angle = Math.random() * Math.PI * 2;
          const explosionSpeed = 2 + Math.random() * 2; // Reduced to 2-4 for slower, more visible explosion
          p.vx = Math.cos(angle) * explosionSpeed;
          p.vy = Math.sin(angle) * explosionSpeed;
          p.z = 0.5 + Math.random(); // Start at various depths
          p.collapsed = false;
        }
        // Gradually slow down particles during explosion for smoother effect
        if (!p.collapsed) {
          p.vx *= 0.99; // Slightly faster slowdown (was 0.995)
          p.vy *= 0.99;
        }
        return true;
      }

      // Normal gravity well behavior for home page
      if (distance > 0 && distance < maxDistance) {
        // Ensure velocities are valid numbers
        if (typeof p.vx !== 'number' || isNaN(p.vx) || !isFinite(p.vx)) {
          p.vx = 0;
        }
        if (typeof p.vy !== 'number' || isNaN(p.vy) || !isFinite(p.vy)) {
          p.vy = 0;
        }
        
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 0.5;
        const angleToBlackHole = Math.atan2(dy, dx);
        const tangentialAngle = angleToBlackHole + Math.PI / 2;
        const spiralInward = 0.35;
        const spiralTangential = 0.65;

        const targetVx =
          Math.cos(angleToBlackHole) * currentSpeed * spiralInward +
          Math.cos(tangentialAngle) * currentSpeed * spiralTangential;
        const targetVy =
          Math.sin(angleToBlackHole) * currentSpeed * spiralInward +
          Math.sin(tangentialAngle) * currentSpeed * spiralTangential;

        p.vx = p.vx * 0.95 + targetVx * 0.05;
        p.vy = p.vy * 0.95 + targetVy * 0.05;

        // Validate velocities after interpolation
        if (isNaN(p.vx) || !isFinite(p.vx)) p.vx = targetVx;
        if (isNaN(p.vy) || !isFinite(p.vy)) p.vy = targetVy;

        const newSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (newSpeed > 0 && isFinite(newSpeed) && isFinite(currentSpeed)) {
          p.vx = (p.vx / newSpeed) * currentSpeed;
          p.vy = (p.vy / newSpeed) * currentSpeed;
        }

        // Final validation before continuing
        if (isNaN(p.vx) || !isFinite(p.vx) || isNaN(p.vy) || !isFinite(p.vy)) {
          resetParticle(p);
          return false;
        }

        if (
          isPointInOval(
            screenX,
            screenY,
            gravityWell.x,
            gravityWell.y,
            gravityWell.eventHorizonX,
            gravityWell.eventHorizonY
          )
        ) {
          resetParticle(p);
          return false;
        }
      }

      return true;
    }

    function draw() {
      // Safety check: ensure ctx is still valid (could be lost in some browsers)
      if (!ctx || !canvas) {
        // Try to recover context
        const newCtx = canvas?.getContext("2d");
        if (!newCtx) {
          // Can't recover, stop animation
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          return;
        }
        ctx = newCtx; // Recover context
      }
      
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Track post-explosion time for deceleration
      if (postExplosionTimeRef.current >= 0 && postExplosionTimeRef.current < 60) {
        postExplosionTimeRef.current += 1; // Increment frame counter
      }

      // Update transition progress
      if (transitionPhaseRef.current === 'collapsing') {
        // Slower progress increment to give more time for collapse
        transitionProgressRef.current += 0.01;
        
        // Check if all particles are collapsed (using particle coordinates, not screen)
        const allCollapsed = particles.every(p => {
          const particleDistance = Math.sqrt(p.x * p.x + p.y * p.y);
          return particleDistance < 30 || p.collapsed;
        });

        // Move to explosion phase when all particles collapsed or after sufficient time
        // Code bubbles are deleted when they reach center, so we only check particles
        if (allCollapsed || transitionProgressRef.current >= 2.0) {
          // Delete all code bubbles (tags) - they don't explode
          codeBubbles.length = 0;
          codeBubblesRef.current = [];
          
          // Signal that collapse is complete (for Navbar to navigate)
          transitionState.setIsTransitioning(false);
          
          // Use requestAnimationFrame instead of setTimeout for better sync with animation
          // This ensures the timeout is tied to the animation loop
          const startExplosion = () => {
            if (!ctx) return; // Safety check
            transitionPhaseRef.current = 'exploding';
            transitionProgressRef.current = 0;
            // Force all particles to exact center for explosion
            particles.forEach(p => {
              p.x = 0;
              p.y = 0;
              p.vx = 0;
              p.vy = 0;
              p.collapsed = true;
            });
            // Signal that explosion can start
            transitionState.setIsTransitioning(true);
          };
          
          // Small delay before starting explosion to allow navigation
          // Use a counter to delay by a few frames instead of setTimeout
          let frameDelay = 0;
          const delayedExplosion = () => {
            frameDelay++;
            if (frameDelay >= 6) { // ~100ms at 60fps
              startExplosion();
              delayedExplosionFrameRef.current = null;
            } else {
              delayedExplosionFrameRef.current = requestAnimationFrame(delayedExplosion);
            }
          };
          delayedExplosionFrameRef.current = requestAnimationFrame(delayedExplosion);
        }
      } else if (transitionPhaseRef.current === 'exploding') {
        // Slow down explosion to last ~2 seconds (at 60fps: 120 frames, so 1.0/120 = 0.0083 per frame)
        transitionProgressRef.current += 0.0083;
        if (transitionProgressRef.current >= 1.0) {
          // Transition complete, switch to normal mode
          transitionPhaseRef.current = 'none';
          transitionProgressRef.current = 0;
          transitionState.setIsTransitioning(false);
          postExplosionTimeRef.current = 0; // Start tracking post-explosion time
          
          // Keep the exploded particles, just adjust their properties for the new page
          // Don't reset them completely - let them continue their outward motion
          particles.forEach(p => {
            // Ensure they have depth properties for 3D starfield
            if (typeof p.z !== 'number' || isNaN(p.z) || !isFinite(p.z)) {
              p.z = randomBetween(0.5, 1.5);
            }
            if (typeof p.speed !== 'number' || isNaN(p.speed) || !isFinite(p.speed)) {
              p.speed = randomBetween(0.0002, 0.0008);
            }
            // Keep existing velocities and positions - particles continue moving outward
            p.collapsed = false;
          });
          
          // Clear code bubbles for non-home pages
          codeBubbles.forEach(bubble => {
            bubble.x = 9999; // Move off screen
            bubble.y = 9999;
          });
          
          // Schedule direction change after 1 second
          if (directionChangeTimeoutRef.current) {
            clearTimeout(directionChangeTimeoutRef.current);
          }
          directionChangeTimeoutRef.current = window.setTimeout(() => {
            // Change direction of all particles after 1 second
            // Use particlesRef to ensure we have the current particles
            const currentParticles = particlesRef.current;
            if (currentParticles && currentParticles.length > 0) {
              currentParticles.forEach(p => {
                // Ensure velocities are valid
                if (typeof p.vx !== 'number' || isNaN(p.vx) || !isFinite(p.vx)) {
                  p.vx = 0;
                }
                if (typeof p.vy !== 'number' || isNaN(p.vy) || !isFinite(p.vy)) {
                  p.vy = 0;
                }
                
                // Reverse or randomize direction
                const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 0.5;
                const newAngle = Math.random() * Math.PI * 2; // Random direction
                
                p.vx = Math.cos(newAngle) * currentSpeed;
                p.vy = Math.sin(newAngle) * currentSpeed;
                
                // Validate new velocities
                if (isNaN(p.vx) || !isFinite(p.vx) || isNaN(p.vy) || !isFinite(p.vy)) {
                  // If validation fails, give safe default velocities
                  p.vx = Math.cos(newAngle) * 0.5;
                  p.vy = Math.sin(newAngle) * 0.5;
                }
              });
            }
            // Stop post-explosion deceleration
            postExplosionTimeRef.current = -1; // Set to -1 to disable deceleration
            directionChangeTimeoutRef.current = null;
          }, 1000);
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        if (transitionPhaseRef.current === 'none') {
          if (isHomePage && !applyGravityWell(p)) {
            continue;
          }
        } else {
          applyGravityWell(p);
        }

        // Handle z-depth for non-home pages (after explosion)
        if (!isHomePage && transitionPhaseRef.current === 'none') {
          p.z -= p.speed;
          if (p.z < 0.05) {
            resetParticle(p);
            continue;
          }
        } else if (transitionPhaseRef.current === 'exploding') {
          // During explosion, particles move outward but z stays constant initially
          // Then gradually decrease z for depth effect
          if (transitionProgressRef.current > 0.3) {
            p.z -= p.speed * 0.5;
          }
        }

        // Ensure velocities are valid before updating position
        if (typeof p.vx !== 'number' || isNaN(p.vx) || !isFinite(p.vx)) {
          p.vx = 0;
        }
        if (typeof p.vy !== 'number' || isNaN(p.vy) || !isFinite(p.vy)) {
          p.vy = 0;
        }
        
        // Clamp velocities to prevent extreme values
        const maxVelocity = 10;
        p.vx = Math.max(-maxVelocity, Math.min(maxVelocity, p.vx));
        p.vy = Math.max(-maxVelocity, Math.min(maxVelocity, p.vy));
        
        // Apply strong deceleration during first second after explosion to keep particles visible
        if (postExplosionTimeRef.current > 0 && postExplosionTimeRef.current < 60) {
          // Gradually slow particles down over the first second
          const decelerationFactor = 0.96; // Stronger deceleration
          p.vx *= decelerationFactor;
          p.vy *= decelerationFactor;
        }
        
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += p.twinkleSpeed;

        const screenX = cx + p.x;
        const screenY = cy + p.y;
        if (
          screenX < -50 ||
          screenX > width + 50 ||
          screenY < -50 ||
          screenY > height + 50
        ) {
          resetParticle(p);
          continue;
        }

        const perspective = 1 / p.z;
        const px = cx + p.x * perspective;
        const py = cy + p.y * perspective;
        const scale = (0.4 + 2 / p.z) * p.size;

        const twinkleAlpha = 0.3 + 0.7 * Math.sin(p.twinkle);
        const finalAlpha = p.opacity * (1.6 - p.z) * twinkleAlpha;

        if (isHomePage) {
          const speed = Math.sqrt((p.vx || 0) ** 2 + (p.vy || 0) ** 2);
          if (speed > 0.1) {
            ctx.globalAlpha = finalAlpha * 0.2;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px - (p.vx || 0) * 5, py - (p.vy || 0) * 5);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, finalAlpha));
        ctx.beginPath();
        ctx.arc(px, py, scale, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10 * (1.6 - p.z) * twinkleAlpha;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.opacity > 0.4 && scale > 1.2) {
          ctx.globalAlpha = finalAlpha * 0.2;
          ctx.beginPath();
          ctx.arc(px, py, scale * 2, 0, 2 * Math.PI);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
      }

      // Draw code bubbles (home page only, not during explosion)
      if ((isHomePage || transitionPhaseRef.current === 'collapsing') && transitionPhaseRef.current !== 'exploding') {
        // Remove bubbles marked for deletion
        for (let i = codeBubbles.length - 1; i >= 0; i--) {
          if (codeBubbles[i].deleteMe) {
            codeBubbles.splice(i, 1);
          }
        }
        
        for (let i = codeBubbles.length - 1; i >= 0; i--) {
          const bubble = codeBubbles[i];

          const screenX = cx + bubble.x;
          const screenY = cy + bubble.y;
          const dx = gravityWell.x - screenX;
          const dy = gravityWell.y - screenY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = Math.max(width, height) * 0.6;

          // Handle transition phases for bubbles
          if (transitionPhaseRef.current === 'collapsing') {
            // Use particle coordinates for distance calculation
            const bubbleDistance = Math.sqrt(bubble.x * bubble.x + bubble.y * bubble.y);
            
            // If bubble reaches center, delete it (don't explode)
            if (bubbleDistance < 30) {
              // Mark for deletion - will be removed in next iteration
              bubble.deleteMe = true;
              continue;
            }

            // Ensure velocities are valid
            if (typeof bubble.vx !== 'number' || isNaN(bubble.vx) || !isFinite(bubble.vx)) {
              bubble.vx = 0;
            }
            if (typeof bubble.vy !== 'number' || isNaN(bubble.vy) || !isFinite(bubble.vy)) {
              bubble.vy = 0;
            }

            // Enhanced gravity well with spiral motion for bubbles (dialed back by 2)
            const collapseStrength = 1.0 + transitionProgressRef.current * 2; // Reduced from 4 to 2
            const currentSpeed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy) || 0.5;
            const angleToBlackHole = Math.atan2(dy, dx);
            const tangentialAngle = angleToBlackHole + Math.PI / 2;
            
            // Spiral motion: balance between inward pull and tangential motion (gentler)
            const spiralInward = 0.5 + transitionProgressRef.current * 0.15; // Reduced from 0.3 to 0.15
            const spiralTangential = 1.0 - spiralInward;
            
            // Calculate target velocity with spiral (less speed enhancement)
            const enhancedSpeed = currentSpeed * (1.0 + collapseStrength * 0.15); // Reduced from 0.3 to 0.15
            const targetVx =
              Math.cos(angleToBlackHole) * enhancedSpeed * spiralInward +
              Math.cos(tangentialAngle) * enhancedSpeed * spiralTangential;
            const targetVy =
              Math.sin(angleToBlackHole) * enhancedSpeed * spiralInward +
              Math.sin(tangentialAngle) * enhancedSpeed * spiralTangential;

            // Validate target velocities
            if (isNaN(targetVx) || !isFinite(targetVx) || isNaN(targetVy) || !isFinite(targetVy)) {
              resetCodeBubble(bubble, i);
              continue;
            }

            // Gentler interpolation toward target velocity
            bubble.vx = bubble.vx * 0.85 + targetVx * 0.15; // Changed from 0.7/0.3 to 0.85/0.15
            bubble.vy = bubble.vy * 0.85 + targetVy * 0.15;

            // Reduced direct acceleration toward center
            const acceleration = collapseStrength * 0.1; // Reduced from 0.2 to 0.1
            bubble.vx += Math.cos(angleToBlackHole) * acceleration;
            bubble.vy += Math.sin(angleToBlackHole) * acceleration;

            // Final validation
            if (isNaN(bubble.vx) || !isFinite(bubble.vx) || isNaN(bubble.vy) || !isFinite(bubble.vy)) {
              resetCodeBubble(bubble, i);
              continue;
            }
          } else if (transitionPhaseRef.current === 'none' && distance > 0 && distance < maxDistance) {
            // Ensure velocities are valid
            if (typeof bubble.vx !== 'number' || isNaN(bubble.vx) || !isFinite(bubble.vx)) {
              bubble.vx = 0;
            }
            if (typeof bubble.vy !== 'number' || isNaN(bubble.vy) || !isFinite(bubble.vy)) {
              bubble.vy = 0;
            }

            const currentSpeed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy) || 0.5;
            const angleToBlackHole = Math.atan2(dy, dx);
            const tangentialAngle = angleToBlackHole + Math.PI / 2;
            const spiralInward = 0.35;
            const spiralTangential = 0.65;

            const targetVx =
              Math.cos(angleToBlackHole) * currentSpeed * spiralInward +
              Math.cos(tangentialAngle) * currentSpeed * spiralTangential;
            const targetVy =
              Math.sin(angleToBlackHole) * currentSpeed * spiralInward +
              Math.sin(tangentialAngle) * currentSpeed * spiralTangential;

            // Validate target velocities
            if (isNaN(targetVx) || !isFinite(targetVx) || isNaN(targetVy) || !isFinite(targetVy)) {
              resetCodeBubble(bubble, i);
              continue;
            }

            bubble.vx = bubble.vx * 0.95 + targetVx * 0.05;
            bubble.vy = bubble.vy * 0.95 + targetVy * 0.05;

            // Validate after interpolation
            if (isNaN(bubble.vx) || !isFinite(bubble.vx)) bubble.vx = targetVx;
            if (isNaN(bubble.vy) || !isFinite(bubble.vy)) bubble.vy = targetVy;

            const newSpeed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy);
            if (newSpeed > 0 && isFinite(newSpeed) && isFinite(currentSpeed)) {
              bubble.vx = (bubble.vx / newSpeed) * currentSpeed;
              bubble.vy = (bubble.vy / newSpeed) * currentSpeed;
            }

            // Final validation
            if (isNaN(bubble.vx) || !isFinite(bubble.vx) || isNaN(bubble.vy) || !isFinite(bubble.vy)) {
              resetCodeBubble(bubble, i);
              continue;
            }

            if (
              isPointInOval(
                screenX,
                screenY,
                gravityWell.x,
                gravityWell.y,
                gravityWell.eventHorizonX,
                gravityWell.eventHorizonY
              )
            ) {
              resetCodeBubble(bubble, i);
              continue;
            }
          }

          // Ensure velocities are valid before updating position
          if (typeof bubble.vx !== 'number' || isNaN(bubble.vx) || !isFinite(bubble.vx)) {
            bubble.vx = 0;
          }
          if (typeof bubble.vy !== 'number' || isNaN(bubble.vy) || !isFinite(bubble.vy)) {
            bubble.vy = 0;
          }
          
          // Clamp velocities to prevent extreme values
          const maxBubbleVelocity = 10;
          bubble.vx = Math.max(-maxBubbleVelocity, Math.min(maxBubbleVelocity, bubble.vx));
          bubble.vy = Math.max(-maxBubbleVelocity, Math.min(maxBubbleVelocity, bubble.vy));
          
          bubble.x += bubble.vx;
          bubble.y += bubble.vy;

          // Don't reset bubbles during transition
          if (transitionPhaseRef.current === 'none') {
            if (
              screenX < -100 ||
              screenX > width + 100 ||
              screenY < -100 ||
              screenY > height + 100
            ) {
              resetCodeBubble(bubble, i);
              continue;
            }
          }

          const perspective = 1 / bubble.z;
          const bx = cx + bubble.x * perspective;
          const by = cy + bubble.y * perspective;
          const bubbleRadius = bubble.size * perspective;

          // Fade out bubbles during transition
          const transitionAlpha = transitionPhaseRef.current !== 'none' 
            ? 1 - transitionProgressRef.current * 0.5 
            : 1;

          ctx.globalAlpha = bubble.opacity * 0.2 * transitionAlpha;
          ctx.fillStyle = "rgba(79, 195, 247, 0.1)";
          ctx.beginPath();
          ctx.arc(bx, by, bubbleRadius, 0, 2 * Math.PI);
          ctx.fill();

          ctx.globalAlpha = bubble.opacity * 0.4 * transitionAlpha;
          ctx.strokeStyle = "#4fc3f7";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(bx, by, bubbleRadius, 0, 2 * Math.PI);
          ctx.stroke();

          ctx.globalAlpha = bubble.opacity * 0.8 * transitionAlpha;
          ctx.fillStyle = "#ffffff";
          ctx.font = `${Math.floor(bubbleRadius * 0.6)}px 'Inter', monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(bubble.text, bx, by);
        }
      }

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener('startCollapse', handleStartCollapse as EventListener);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (delayedExplosionFrameRef.current) {
        cancelAnimationFrame(delayedExplosionFrameRef.current);
        delayedExplosionFrameRef.current = null;
      }
      if (directionChangeTimeoutRef.current) {
        clearTimeout(directionChangeTimeoutRef.current);
        directionChangeTimeoutRef.current = null;
      }
      // Reset transition state on unmount
      transitionState.setIsTransitioning(false);
    };
  }, [location.pathname]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}


