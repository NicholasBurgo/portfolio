import { useEffect, useRef, useState } from "react";

import { Helmet } from "react-helmet-async";




export default function Home() {

    const nameRef = useRef<HTMLDivElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const [nameLetters, setNameLetters] = useState<HTMLSpanElement[]>([]);
    const [subtitleReady, setSubtitleReady] = useState(false);
    const waveTextRef = useRef<HTMLDivElement>(null);








    const phrases = [
        "COMPUTER SCIENCE STUDENT | FULL STACK DEVELOPER.",
        "READY TO INNOVATE.",
        "READY TO COLLABORATE.",
        "READY TO BUILD THE FUTURE.",
    ];

    useEffect(() => {
        // Initialize name
        const nameElement = nameRef.current;
        if (!nameElement) return;

        const fullName = "NICHOLAS BURGO";
        const letters: HTMLSpanElement[] = [];

        nameElement.innerHTML = "";
        const nameWrapper = document.createElement("div");
        nameWrapper.style.display = "inline-flex";
        nameWrapper.style.gap = "0";

        // Check if mobile (under 640px) - 2x bigger on mobile
        const isMobile = window.innerWidth < 640;
        const fontSize = isMobile ? "4.5rem" : (window.innerWidth < 768 ? "3.75rem" : "5rem");

        fullName.split("").forEach((char) => {
            const span = document.createElement("span");

            const letterSpan = document.createElement("span");
            if (char === " ") {
                letterSpan.innerHTML = "&nbsp;";
                letterSpan.style.marginLeft = "0.5rem";
                letterSpan.style.marginRight = "0.5rem";
            } else {
                letterSpan.textContent = char;
            }

            letterSpan.style.fontSize = fontSize;
            letterSpan.style.display = "inline-block";
            letterSpan.style.transition = "transform 0.2s ease-out";

            span.appendChild(letterSpan);
            nameWrapper.appendChild(span);
            letters.push(letterSpan);
        });

        nameElement.appendChild(nameWrapper);
        setNameLetters(letters);

        // Glitch in animation
        setTimeout(() => {
            nameWrapper.classList.add("glitch-in");
            setTimeout(() => {
                setSubtitleReady(true);
            }, 400);
        }, 500);
    }, []);

    useEffect(() => {
        // Mouse-over effect for name
        if (nameLetters.length === 0) return;

        let resetTimeout: number | null = null;

        const updateLetters = (clientX: number, clientY: number) => {
            nameLetters.forEach((letter) => {
                const rect = letter.getBoundingClientRect();
                const letterX = rect.left + rect.width / 2;
                const letterY = rect.top + rect.height / 2;

                const distX = clientX - letterX;
                const distY = clientY - letterY;
                const distance = Math.sqrt(distX ** 2 + distY ** 2);

                if (distance < 80) {
                    const angle = Math.atan2(distY, distX);
                    const offset = (80 - distance) / 3;
                    letter.style.transform = `translate(${-Math.cos(angle) * offset}px, ${-Math.sin(angle) * offset}px)`;
                } else {
                    letter.style.transform = "translate(0, 0)";
                }
            });
        };

        const resetLetters = () => {
            nameLetters.forEach((letter) => {
                letter.style.transform = "";
            });
        };

        const clearResetTimeout = () => {
            if (resetTimeout) {
                clearTimeout(resetTimeout);
                resetTimeout = null;
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            updateLetters(e.clientX, e.clientY);
            clearResetTimeout();
        };

        const handleTouch = (e: TouchEvent) => {
            const touch = e.touches[0];
            if (touch) {
                updateLetters(touch.clientX, touch.clientY);
            }
            clearResetTimeout();
        };

        const handleTouchEnd = () => {
            clearResetTimeout();
            resetTimeout = window.setTimeout(() => {
                resetLetters();
            }, 500);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("touchstart", handleTouch, { passive: true });
        document.addEventListener("touchmove", handleTouch, { passive: true });
        document.addEventListener("touchend", handleTouchEnd);
        document.addEventListener("touchcancel", handleTouchEnd);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("touchstart", handleTouch);
            document.removeEventListener("touchmove", handleTouch);
            document.removeEventListener("touchend", handleTouchEnd);
            document.removeEventListener("touchcancel", handleTouchEnd);
            if (resetTimeout) {
                clearTimeout(resetTimeout);
            }
        };
    }, [nameLetters]);

    useEffect(() => {
        // Subtitle typing animation
        if (!subtitleReady || !subtitleRef.current) return;

        let currentPhraseIndex = 0;
        let letterElements: HTMLSpanElement[] = [];
        let lineWrapper: HTMLDivElement | null = null;

        const createLetterSpans = (text: string) => {
            if (!subtitleRef.current) return;

            subtitleRef.current.innerHTML = "";
            letterElements = [];

            lineWrapper = document.createElement("div");
            lineWrapper.style.display = "inline-flex";
            lineWrapper.style.gap = "0";

            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const span = document.createElement("span");

                if (char === " ") {
                    span.innerHTML = "&nbsp;";
                    span.style.marginLeft = "0.25rem";
                    span.style.marginRight = "0.25rem";
                } else {
                    span.textContent = char;
                }

                span.style.display = "inline-block";
                span.style.transition = "transform 0.2s ease-out";
                lineWrapper.appendChild(span);
                letterElements.push(span);
            }

            subtitleRef.current.appendChild(lineWrapper);
        };

        const glitchInPhrase = () => {
            const currentPhrase = phrases[currentPhraseIndex];
            createLetterSpans(currentPhrase);

            if (lineWrapper) {
                // Start hidden, then fade in
                lineWrapper.style.opacity = "0";
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        lineWrapper!.style.opacity = "";
                        lineWrapper!.classList.add("glitch-in");
                    });
                });

                setTimeout(() => {
                    glitchOutPhrase();
                }, 3500);
            }
        };

        const glitchOutPhrase = () => {
            if (!lineWrapper) return;

            lineWrapper.classList.remove("glitch-in");
            lineWrapper.classList.add("glitch-out");

            setTimeout(() => {
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                glitchInPhrase();
            }, 350);
        };

        // Mouse-over effect for subtitle
        let subtitleResetTimeout: number | null = null;

        const updateSubtitleLetters = (clientX: number, clientY: number) => {
            letterElements.forEach((letter) => {
                const rect = letter.getBoundingClientRect();
                const letterX = rect.left + rect.width / 2;
                const letterY = rect.top + rect.height / 2;

                const distX = clientX - letterX;
                const distY = clientY - letterY;
                const distance = Math.sqrt(distX ** 2 + distY ** 2);

                if (distance < 80) {
                    const angle = Math.atan2(distY, distX);
                    const offset = (80 - distance) / 3;
                    letter.style.transform = `translate(${-Math.cos(angle) * offset}px, ${-Math.sin(angle) * offset}px)`;
                } else {
                    letter.style.transform = "translate(0, 0)";
                }
            });
        };

        const resetSubtitleLetters = () => {
            letterElements.forEach((letter) => {
                letter.style.transform = "";
            });
        };

        const clearSubtitleResetTimeout = () => {
            if (subtitleResetTimeout) {
                clearTimeout(subtitleResetTimeout);
                subtitleResetTimeout = null;
            }
        };

        const handleSubtitleMouseMove = (e: MouseEvent) => {
            updateSubtitleLetters(e.clientX, e.clientY);
            clearSubtitleResetTimeout();
        };

        const handleSubtitleTouch = (e: TouchEvent) => {
            const touch = e.touches[0];
            if (touch) {
                updateSubtitleLetters(touch.clientX, touch.clientY);
            }
            clearSubtitleResetTimeout();
        };

        const handleSubtitleTouchEnd = () => {
            clearSubtitleResetTimeout();
            subtitleResetTimeout = window.setTimeout(() => {
                resetSubtitleLetters();
            }, 500);
        };

        document.addEventListener("mousemove", handleSubtitleMouseMove);
        document.addEventListener("touchstart", handleSubtitleTouch, { passive: true });
        document.addEventListener("touchmove", handleSubtitleTouch, { passive: true });
        document.addEventListener("touchend", handleSubtitleTouchEnd);
        document.addEventListener("touchcancel", handleSubtitleTouchEnd);

        setTimeout(glitchInPhrase, 500);

        return () => {
            document.removeEventListener("mousemove", handleSubtitleMouseMove);
            document.removeEventListener("touchstart", handleSubtitleTouch);
            document.removeEventListener("touchmove", handleSubtitleTouch);
            document.removeEventListener("touchend", handleSubtitleTouchEnd);
            document.removeEventListener("touchcancel", handleSubtitleTouchEnd);
            if (subtitleResetTimeout) {
                clearTimeout(subtitleResetTimeout);
            }
        };
    }, [subtitleReady]);

    useEffect(() => {
        // Wave animation
        const triggerWave = () => {
            const wave = waveTextRef.current;
            if (!wave) return;

            wave.classList.remove("wave-animate");
            void wave.offsetWidth; // Trigger reflow
            wave.classList.add("wave-animate");
            setTimeout(triggerWave, 9500);
        };

        setTimeout(triggerWave, 6000);
    }, []);

    useEffect(() => {
        // Background activation
        const updateActiveBackground = () => {
            const section = document.querySelector(".home-bg");
            if (section) {
                section.classList.add("active");
            }
        };

        updateActiveBackground();
        window.addEventListener("scroll", updateActiveBackground);
        return () => window.removeEventListener("scroll", updateActiveBackground);
    }, []);

    return (
        <>
            <Helmet>
                <title>Nicholas Burgo</title>
                <meta name="description" content="Nicholas Burgo - Computer Science Student | Full Stack Developer" />
            </Helmet>
            <section
                id="home"
                className="section-bg home-bg min-h-screen flex flex-col items-center justify-between px-4 text-center pt-26 pb-8 relative"
            >
                <div className="flex-1 flex flex-col items-center justify-center relative z-10 -mt-20 sm:mt-0">
                    <div className="animate-scale-in" style={{ transform: 'rotate(2deg)' }}>
                        <h2 className="font-extrabold tracking-tight text-white mb-14 whitespace-nowrap">
                            <div id="name" ref={nameRef} className="flex justify-center gap-0"></div>
                        </h2>
                        <span className="mx-4"></span>
                        <p className="mt-4 sm:mt-16 text-base sm:text-lg text-white/80 tracking-widest uppercase">
                            <span
                                id="typing-subtitle"
                                ref={subtitleRef}
                                className="subtitle flex justify-center gap-0"
                            ></span>
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center w-full z-20">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">


                    </div>
                </div>
            </section>



            {/* Featured Projects Section */}

        </>
    );
}

