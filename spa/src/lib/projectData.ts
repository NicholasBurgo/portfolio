export interface Project {
  title: string;
  tech: string[];
  desc: string;
  longDesc: string;
  thumbnail: string; // Front/thumbnail image for project card
  images: string[]; // Additional images for modal gallery
  links: Array<{ type: string; url: string }>;
  category: "fullstack" | "gamedev" | "database" | "frontend";
}

const getAssetPath = (path: string) => {
  if (!path) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
};

export const projectData: Project[] = [
  {
    title: "Fable Market",
    tech: ["React", "FastAPI", "PostgreSQL"],
    desc: "A comprehensive book marketplace platform with features for purchasing books, leaving reviews, and creating personalized book lists with advanced search functionality.",
    longDesc: `<b>Role:</b> Team Leader, Full Stack Developer<br>
      <b>Problem:</b> Need for a comprehensive platform where users can discover, purchase, and review books with personalized features.<br>
      <b>Solution:</b> Developed a full-featured book marketplace with advanced search capabilities, user reviews, and personalized book lists to enhance the book discovery experience.<br>
      <b>Key Features:</b> Advanced search functionality by title, author, and genre using optimized string comparison queries, integrated database management for efficient data operations, user review system, and personalized book list creation with data integrity enforcement.`,
    thumbnail: getAssetPath("images/fable.png"),
    images: [
      getAssetPath("images/fableMarket2.png"),
      getAssetPath("images/fable-search.jpg"),
      getAssetPath("images/fable-search2.jpg"),
    ],
    links: [],
    category: "fullstack",
  },
  {
    title: "Car Dealership Database",
    tech: ["SQL", "Database Management"],
    desc: "Architected a comprehensive 5-table relational database system for car-rental operations with full ER-diagram modeling and SQL implementation.",
    longDesc: `<b>Role:</b> Team Leader, Database Architect<br>
      <b>Problem:</b> Need for a robust relational database system to manage complex car-rental operations with proper data integrity.<br>
      <b>Solution:</b> Designed and implemented a normalized 5-table database schema following 3NF principles with comprehensive ER-diagram modeling and SQL DDL implementation.<br>
      <b>Key Features:</b> Fully annotated ER-diagram with min/max participation constraints, SQL DDL with primary/foreign-key enforcement and cascading rules, seeded database with 100+ realistic records using bulk-load scripts, traceable BO&R documentation linking business requirements to database structure, and FK-mapping matrix for team collaboration.`,
    thumbnail: getAssetPath("images/car-dealership.jpg"),
    images: [],
    links: [
      {
        type: "github",
        url: "https://github.com/NicholasBurgo/Car-Dealership",
      },
    ],
    category: "database",
  },
  {
    title: "CityRift VR",
    tech: ["C#", "Unity", "Blender"],
    desc: "End-to-end virtual reality sandbox built in Unity combining first-person weapon mechanics with AI-driven open world environments.",
    longDesc: `<b>Role:</b> Game Developer, VR Specialist<br>
      <b>Problem:</b> Creating an immersive VR experience that combines realistic weapon mechanics with intelligent AI behavior in an open world.<br>
      <b>Solution:</b> Built a comprehensive VR sandbox using Unity with C# comprising 90% of the codebase, featuring advanced VR-rig locomotion, ray-cast gun mechanics, and autonomous AI systems.<br>
      <b>Key Features:</b> VR-rig locomotion system with comfortable movement, ray-cast gun logic with realistic weapon mechanics, enemy/pedestrian state machines with reactive AI behavior, autonomous traffic system with lane-following rules, explorable streetscape environment, multiplatform builds with IL2CPP + Burst optimization, and comprehensive version control with clean collaboration setup.`,
    thumbnail: getAssetPath("images/vr.jpg"),
    images: [getAssetPath("images/vr-shooter2.jpg")],
    links: [
      {
        type: "github",
        url: "https://github.com/NicholasBurgo/VrShooter",
      },
    ],
    category: "gamedev",
  },
  {
    title: "Lua Multiplayer Networking",
    tech: ["Lua", "Love Engine"],
    desc: "Engaging local multiplayer mini-games built with Lua using host-client architecture for seamless real-time player interactions.",
    longDesc: `<b>Role:</b> Game Developer, Network Programmer<br>
      <b>Problem:</b> Creating engaging multiplayer experiences with real-time communication and seamless player interactions.<br>
      <b>Solution:</b> Developed local multiplayer mini-games using Lua and Love Engine with robust host-client networking architecture for dynamic player interactions.<br>
      <b>Key Features:</b> Host-client architecture for reliable multiplayer connections, real-time communication system enabling dynamic player interactions, multiple mini-game modes with engaging gameplay mechanics, and optimized networking code for smooth multiplayer experience.`,
    thumbnail: getAssetPath("images/lua.jpg"),
    images: [
      getAssetPath("images/lua-multiplayer2.jpg"),
      getAssetPath("images/lua-networking.jpg"),
      getAssetPath("images/lua-games.jpg"),
      getAssetPath("images/lua-games2.jpg"),
    ],
    links: [
      {
        type: "github",
        url: "https://github.com/NicholasBurgo/MultiplayerGame",
      },
    ],
    category: "gamedev",
  },
  {
    title: "Portfolio Template",
    tech: ["HTML", "CSS", "JavaScript"],
    desc: "A clean, single-page portfolio template with dark theme and interactive animations - perfect for students and developers who want a professional, customizable portfolio.",
    longDesc: `<b>Role:</b> Frontend Developer, UI/UX Designer<br>
      <b>Problem:</b> Need for a professional portfolio template that's better than basic online templates, with cool animations and easy customization for students.<br>
      <b>Solution:</b> Created a single-page portfolio template with dark theme, interactive hover effects, and a simple configuration system for easy personalization.<br>
      <b>Key Features:</b> Single-page design with dark theme, interactive name hover effects, project showcase with modal system, about me section with skills, contact information, easy-to-use configuration object, Tailwind CSS styling, Font Awesome icons, and GitHub Pages deployment ready.`,
    thumbnail: "", // No thumbnail - uses icon placeholder
    images: [
      getAssetPath("images/portfolio-template-1.jpg"),
      getAssetPath("images/portfolio-template-2.jpg"),
      getAssetPath("images/portfolio-template-3.jpg"),
    ],
    links: [
      {
        type: "github",
        url: "https://github.com/NicholasBurgo/portfolio_Template",
      },
      {
        type: "demo",
        url: "https://nicholasburgo.github.io/portfolio_Template/",
      },
    ],
    category: "frontend",
  },
];


