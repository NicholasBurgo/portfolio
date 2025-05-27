// Particle effect
function createParticles(id, count, animationPrefix = "floatDot") {
  const container = document.getElementById(id);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    dot.style.position = "absolute";
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    const size = 4 + Math.random() * 6;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.borderRadius = "50%";
    dot.style.background = "rgba(79,195,247,0.13)";
    dot.style.filter = "blur(1.5px)";
    const animName = `${animationPrefix}${i}`;
    dot.style.animation = `${animName} ${5 + Math.random() * 6}s ease-in-out ${
      Math.random() * 6
    }s infinite alternate`;
    container.appendChild(dot);

    const styleSheet = document.styleSheets[document.styleSheets.length - 1];
    const moveY = -25 + Math.random() * 50;
    styleSheet.insertRule(
      `@keyframes ${animName} {
        0% { transform: translateY(0px); }
        100% { transform: translateY(${moveY}px); }
      }`,
      styleSheet.cssRules.length
    );
  }
}

// Run particles on load
window.addEventListener("DOMContentLoaded", () => {
  createParticles("particle-background", 32);
});

// Project modal logic
const projectData = [
  {
    title: "AI Academic Advisor",
    tech: ["Next.js", "Tailwind", "Firebase", "UX Pilot AI API"],
    desc: "A chatbot trained on university data that helps students with degree planning and course selection.",
    longDesc: `I led the design and development of a conversational academic advisor for students.<br>
      <b>Role:</b> Full Stack Engineer, AI Integrator<br>
      <b>Problem:</b> Students struggle to find up-to-date degree requirements and receive course advice.<br>
      <b>Solution:</b> Trained a chatbot on university data to provide instant degree planning, course selection guidance, and personalized tips.<br>
      <b>Tools:</b> Next.js, Tailwind CSS, Firebase, UX Pilot AI API, TypeScript.`,
    links: [
      { type: "demo", url: "#" },
      { type: "github", url: "#" },
    ],
    screenshots: [],
    video: "",
  },
  {
    title: "Modern Portfolio Site",
    tech: ["React", "Next.js", "Tailwind", "Framer Motion"],
    desc: "A personal website and portfolio built for performance, accessibility, and modern design.",
    longDesc: `<b>Role:</b> Designer & Developer<br>
      <b>Problem:</b> Needed a site to showcase projects and blog posts in a way that reflects my design philosophy.<br>
      <b>Solution:</b> Built a responsive, fast, accessible portfolio with glowing UI and smooth animations.<br>
      <b>Tools:</b> Next.js, Tailwind CSS, Framer Motion`,
    links: [
      { type: "demo", url: "#" },
      { type: "github", url: "#" },
    ],
    screenshots: [],
    video: "",
  },
  {
    title: "AI Image Generator",
    tech: ["Vercel AI", "Next.js", "Tailwind", "TypeScript"],
    desc: "Generate photorealistic images from prompts using diffusion models.",
    longDesc: `<b>Role:</b> Full Stack Developer<br>
      <b>Problem:</b> Making AI image generation accessible and fun.<br>
      <b>Solution:</b> Built a web app with prompt builder, instant results, and a favorites gallery.<br>
      <b>Tools:</b> Next.js, Vercel AI SDK, Tailwind CSS, TypeScript`,
    links: [
      { type: "demo", url: "#" },
      { type: "github", url: "#" },
    ],
    screenshots: [],
    video: "",
  },
];

function openProjectModal(idx) {
  const modal = document.getElementById("project-modal-overlay");
  const content = document.getElementById("project-modal-content");
  const data = projectData[idx];
  if (!content) return;

  const techHTML = data.tech
    .map((t) => `<span class="tag-chip mb-1">${t}</span>`)
    .join("");
  const linksHTML = data.links
    .map((link) => {
      if (link.type === "demo") {
        return `<a href="${link.url}" target="_blank" class="rounded-full bg-[#4fc3f7] px-5 py-2 text-[#0e1627] font-semibold shadow-xl hover:bg-[#90caf9] transition text-sm flex items-center gap-2 mr-3">
                <span>Live Demo</span><i class="fa-solid fa-arrow-up-right-from-square text-base"></i>
              </a>`;
      }
      if (link.type === "github") {
        return `<a href="${link.url}" target="_blank" class="rounded-full bg-[#223050e6] border border-[#4fc3f7] px-4 py-2 text-[#4fc3f7] font-semibold shadow hover:bg-[#263d5c] transition flex items-center gap-2 text-sm">
                <i class="fa-brands fa-github"></i><span>GitHub</span>
              </a>`;
      }
      return "";
    })
    .join("");

  content.innerHTML = `
    <h3 class="text-2xl font-bold mb-1 text-white tracking-tight">${data.title}</h3>
    <div class="mb-2 flex flex-wrap gap-y-1">${techHTML}</div>
    <div class="mb-3 text-[#b1c9e7] text-base">${data.desc}</div>
    <div class="text-sm text-[#aadcf2] leading-relaxed mb-2">${data.longDesc}</div>
    <div class="flex gap-4 mt-5">${linksHTML}</div>
  `;

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  document.getElementById("project-modal-overlay").classList.add("hidden");
  document.body.style.overflow = "";
}

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeProjectModal();
});

// Contact form (Formspree demo)
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const spinner = document.getElementById("contact-spinner");
    const toast = document.getElementById("contact-toast");
    const submitBtn = document.getElementById("contact-submit");

    spinner.classList.remove("hidden");
    submitBtn.disabled = true;
    toast.classList.add("hidden");

    const endpoint = "https://formspree.io/f/mwkgnwzq";
    const data = {
      name: contactForm.name.value,
      email: contactForm.email.value,
      message: contactForm.message.value,
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      spinner.classList.add("hidden");
      submitBtn.disabled = false;

      if (res.ok) {
        toast.textContent = "Message sent! I'll be in touch 👋";
        toast.classList.remove("hidden");
        toast.classList.remove("text-red-400");
        toast.classList.add("text-[#4fc3f7]");
        contactForm.reset();
      } else {
        throw new Error("Failed");
      }
    } catch {
      toast.textContent = "Something went wrong. Please try again!";
      toast.classList.remove("hidden");
      toast.classList.remove("text-[#4fc3f7]");
      toast.classList.add("text-red-400");
    }

    setTimeout(() => toast.classList.add("hidden"), 3000);
  });
}
