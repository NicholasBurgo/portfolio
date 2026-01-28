export interface Project {
  id: string;
  title: string;
  dateRange: { start: string; end: string | null }; // Format: "YYYY-MM"
  summary: string; // Exactly one sentence
  highlights: string[]; // 3-5 bullets max
  ownership: { role: string; responsibilities: string[] };
  tech: string[];
  images: Array<{ src: string; alt: string }>;
  links: { github: string; liveDemo?: string; linkedin?: string };
  thumbnail: string; // Front/thumbnail image for project card
  category: "fullstack" | "gamedev" | "database" | "frontend" | "AI";
}

const getAssetPath = (path: string) => {
  if (!path) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
};

// Helper function to format date range for display
export const formatDateRange = (start: string, end: string | null): string => {
  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };
  
  const startFormatted = formatDate(start);
  const endFormatted = end ? formatDate(end) : 'Present';
  return `${startFormatted} to ${endFormatted}`;
};

export const projectData: Project[] = [
  {
    id: "site-extractor",
    title: "Site Extractor",
    dateRange: { start: "2025-06", end: null },
    summary: "A full stack website extraction system that crawls existing sites and converts unstructured web content into clean, structured, editable data.",
    highlights: [
      "Built a multi stage crawler supporting HTML, PDF, DOCX, JSON, CSV, and image extraction with rate limiting and bot avoidance",
      "Implemented near duplicate detection, UI element filtering, and content normalization into structured page objects",
      "Designed heuristic page classification to infer page intent such as home, category, product, service, and company",
      "Built a React interface for real time crawl monitoring and extracted content review",
      "Structured extracted data to support downstream consumers such as static site generation or data analysis"
    ],
    ownership: {
      role: "Founder and Lead Engineer",
      responsibilities: [
        "Crawling and extraction architecture",
        "Content normalization and classification pipeline",
        "Data modeling and storage",
        "Frontend tooling for inspection and validation"
      ]
    },
    tech: ["FastAPI and Python", "React and TypeScript", "aiohttp, BeautifulSoup, readability, trafilatura", "Playwright and advanced scraping tooling", "Structured pipeline driven storage"],
    images: [
      { src: getAssetPath("images/SiteExtractor1.png"), alt: "Site Extractor interface screenshot 1" },
      { src: getAssetPath("images/SiteExtractor2.png"), alt: "Site Extractor interface screenshot 2" },
      { src: getAssetPath("images/SiteExtractor3.png"), alt: "Site Extractor interface screenshot 3" },
      { src: getAssetPath("images/SiteExtractor4.png"), alt: "Site Extractor interface screenshot 4" },
      { src: getAssetPath("images/SiteExtractor5.png"), alt: "Site Extractor interface screenshot 5" },
      { src: getAssetPath("images/SiteExtractor6.png"), alt: "Site Extractor interface screenshot 6" },
      { src: getAssetPath("images/SiteExtractor7.png"), alt: "Site Extractor interface screenshot 7" }
    ],
    links: {
      // TODO: Replace with actual GitHub repository URL
      github: "",
      // TODO: Add Live Demo URL if available
      liveDemo: ""
    },
    thumbnail: getAssetPath("images/SiteExtractor1.png"),
    category: "fullstack",
  },
  {
    id: "fable-market",
    title: "Fable Market",
    dateRange: { start: "2024-08", end: "2024-11" },
    summary: "A foundational full stack book marketplace platform enabling users to search, review, and organize books through personalized lists.",
    highlights: [
      "Designed and implemented REST API with structured endpoints for books, users, reviews, and lists",
      "Modeled relational database schema with PostgreSQL for users, books, reviews, and personalized book lists",
      "Built search functionality supporting queries by title, author, and genre",
      "Implemented user review system with data validation and integrity constraints",
      "Created personalized book list feature with user-specific collections"
    ],
    ownership: {
      role: "Team Lead, Full Stack Developer",
      responsibilities: [
        "Led team in full stack development",
        "Architected database schema and API structure",
        "Implemented frontend components and backend endpoints",
        "Coordinated feature development and code reviews"
      ]
    },
    tech: ["React", "FastAPI", "PostgreSQL"],
    images: [
      { src: getAssetPath("images/fableMarket2.png"), alt: "Fable Market main interface" },
      { src: getAssetPath("images/fable-search.jpg"), alt: "Fable Market search functionality" },
      { src: getAssetPath("images/fable-search2.jpg"), alt: "Fable Market search results" }
    ],
    links: {
      github: ""
    },
    thumbnail: getAssetPath("images/fable.png"),
    category: "fullstack",
  },
  {
    id: "car-dealership-database",
    title: "Car Dealership Database",
    dateRange: { start: "2025-03", end: "2025-05" },
    summary: "A relational database system designed to model inventory, customers, and sales operations for a car dealership with a focus on data integrity and query correctness.",
    highlights: [
      "Designed a normalized relational schema covering vehicles, customers, sales, and inventory",
      "Implemented primary keys, foreign keys, and constraints to enforce data integrity",
      "Wrote multi table SQL queries using joins, filters, and aggregations",
      "Structured relationships to reflect real world dealership operations"
    ],
    ownership: {
      role: "Sole Designer and Developer",
      responsibilities: [
        "Database schema design",
        "Relationship modeling and normalization",
        "SQL query implementation and validation"
      ]
    },
    tech: ["SQL", "Relational Database Design", "PostgreSQL"],
    images: [], // No screenshots available for this project
    links: {
      // TODO: Replace with actual repo URL if different
      github: "https://github.com/NicholasBurgo/Car-Dealership"
    },
    thumbnail: getAssetPath("images/car-dealership.jpg"),
    category: "database",
  },
  {
    id: "city-rift-vr",
    title: "City Rift VR",
    dateRange: { start: "2025-01", end: "2025-07" },
    summary: "A Unity based VR city shooter prototype focused on dynamic node systems, traffic control, and environmental simulation to create a living urban space.",
    highlights: [
      "Designed and implemented node based city systems for movement and interaction",
      "Built dynamic traffic and flow control logic to simulate a living environment",
      "Created system driven behaviors that made the city feel active rather than scripted",
      "Integrated simulation systems with VR interaction and player movement",
      "Considered performance and comfort constraints specific to VR environments"
    ],
    ownership: {
      role: "Systems and Gameplay Developer",
      responsibilities: [
        "Node system design and implementation",
        "Traffic control and dynamic movement logic",
        "Environmental simulation and world activity",
        "Integration with VR interaction systems"
      ]
    },
    tech: ["Unity", "C#", "XR and VR interaction systems", "Simulation and real time systems"],
    images: [
      { src: getAssetPath("images/vr-shooter2.jpg"), alt: "City Rift VR gameplay" }
    ],
    links: {
      github: "https://github.com/NicholasBurgo/VrShooter"
    },
    thumbnail: getAssetPath("images/vr.jpg"),
    category: "gamedev",
  },
  {
    id: "multiplayer-madness",
    title: "Multiplayer Madness",
    dateRange: { start: "2024-09", end: "2024-11" },
    summary: "A multiplayer networking project built in Lua to explore peer to peer communication, state synchronization, and the challenges of real time game networking.",
    highlights: [
      "Implemented basic peer to peer style networking using Lua",
      "Designed message handling for game state updates",
      "Explored synchronization, latency, and ordering issues",
      "Identified architectural limitations of naive multiplayer approaches"
    ],
    ownership: {
      role: "Sole Developer",
      responsibilities: [
        "Networking logic design",
        "Message handling and state synchronization",
        "Debugging latency and consistency issues"
      ]
    },
    tech: ["Lua", "LÖVE framework", "Networking and socket based communication"],
    images: [
      { src: getAssetPath("images/lua-multiplayer2.jpg"), alt: "Lua multiplayer game interface" },
      { src: getAssetPath("images/lua-networking.jpg"), alt: "Lua networking architecture" },
      { src: getAssetPath("images/lua-games.jpg"), alt: "Lua game modes" },
      { src: getAssetPath("images/lua-games2.jpg"), alt: "Lua multiplayer gameplay" }
    ],
    links: {
      github: "https://github.com/NicholasBurgo/MultiplayerGame"
    },
    thumbnail: getAssetPath("images/lua.jpg"),
    category: "gamedev",
  },
  {
    id: "portfolio-template-website",
    title: "Portfolio Template Website",
    dateRange: { start: "2025-07", end: "2025-09" },
    summary: "A reusable portfolio website template built for Computer Science students with a clear layout, easy customization, and published documentation.",
    highlights: [
      "Created a clean, minimal portfolio template that others can fork and customize",
      "Structured content to be easy to edit without deep code changes",
      "Wrote a step by step README covering setup and customization",
      "Published a live demo alongside the GitHub repository",
      "Focused on presentation clarity and usability over flashy visuals"
    ],
    ownership: {
      role: "Sole Developer",
      responsibilities: [
        "Frontend implementation and layout",
        "Template configuration and customization flow",
        "Documentation and publishing"
      ]
    },
    tech: ["HTML", "CSS", "JavaScript"],
    images: [
      { src: getAssetPath("images/portfolio-template-1.jpg"), alt: "Portfolio Template Website homepage" },
      { src: getAssetPath("images/portfolio-template-2.jpg"), alt: "Portfolio Template Website projects section" },
      { src: getAssetPath("images/portfolio-template-3.jpg"), alt: "Portfolio Template Website about section" }
    ],
    links: {
      github: "https://github.com/NicholasBurgo/portfolio_Template",
      liveDemo: "https://nicholasburgo.github.io/portfolio_Template/"
    },
    thumbnail: getAssetPath("images/portfolio-template-1.jpg"),
    category: "frontend",
  },
  {
    id: "astro-slayer",
    title: "Astro Slayer",
    dateRange: { start: "2025-10", end: "2025-12" },
    summary: "A Pygame arcade space game featuring physics based ship control, charged attacks, asteroid splitting, and a multi phase boss fight with hazard patterns and audio driven transitions.",
    highlights: [
      "Built ship movement with thrust, rotation, friction, speed limits, and screen wrapping in a manual 60 FPS loop",
      "Implemented charged shooting that scales damage and switches to a beam attack at full charge with recoil and hit tracking",
      "Designed asteroid systems with three sizes, collision resolution, scoring, and split logic from large to medium to small",
      "Created a boss encounter with warning lasers, arcing projectile waves, charge attacks, a health bar UI, and music and dialogue sequences"
    ],
    ownership: {
      role: "Sole Developer",
      responsibilities: [
        "Gameplay systems and combat mechanics",
        "Enemy behaviors, hazards, and boss logic",
        "UI indicators for health, abilities, and cooldowns",
        "Audio sequencing, transitions, and intro flow"
      ]
    },
    tech: ["Python", "Pygame", "Sprite and audio asset pipeline with fallback loading", "Real time rendering, collision math, and state driven game logic"],
    images: [
      { src: getAssetPath("images/AstroSlayer1.png"), alt: "Astro Slayer gameplay screenshot 1" },
      { src: getAssetPath("images/AstroSlayer2.png"), alt: "Astro Slayer gameplay screenshot 2" },
      { src: getAssetPath("images/AstroSlayer3.png"), alt: "Astro Slayer gameplay screenshot 3" },
      { src: getAssetPath("images/AstroSlayer4.png"), alt: "Astro Slayer gameplay screenshot 4" }
    ],
    links: {
      github: "https://github.com/NicholasBurgo/GameDevClass",
      linkedin: "https://www.linkedin.com/posts/nicholas-burgo_hey-everyone-i-wanted-to-share-some-projects-activity-7407143477467127809-2364?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEXrMjoBh2Y_qoL5O58kRnDoOZ2Lbf_VwQw"
    },
    thumbnail: getAssetPath("images/AstroSlayer1.png"),
    category: "gamedev",
  },
  {
    id: "ai-stock-price-prediction",
    title: "AI Stock Price Prediction",
    dateRange: { start: "2025-10", end: "2025-12" },
    summary: "A machine learning project evaluating multiple time series models for predicting stock price movements using historical market data and engineered technical indicators.",
    highlights: [
      "Implemented and compared LSTM, GRU, and ensemble based time series models",
      "Engineered rolling technical indicators and lag based features from historical price data",
      "Applied proper time series train validation test splits to prevent data leakage",
      "Evaluated models using error metrics and directional accuracy rather than profit claims"
    ],
    ownership: {
      role: "Sole Developer",
      responsibilities: [
        "Data collection and preprocessing",
        "Feature engineering and indicator creation",
        "Model training, tuning, and evaluation",
        "Analysis and comparison of model performance"
      ]
    },
    tech: ["Python", "Pandas and NumPy", "TensorFlow or PyTorch", "Scikit learn", "Time series modeling techniques"],
    images: [], // TODO: Add prediction vs actual plots if available
    links: {
      github: "https://github.com/NicholasBurgo/AIClass/tree/main/stock_lstm_project"
    },
    thumbnail: getAssetPath("images/AIstock.png"),
    category: "AI",
  },
];


