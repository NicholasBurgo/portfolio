const a=[{slug:"stock-prediction-neural-network",title:"Building a Stock Prediction Neural Network as a Student",subtitle:"Learning Deep Learning Through Real-World Application",date:"2024-01-15",readingTime:"8 min read",tags:["AI","Machine Learning","Python","Neural Networks"],excerpt:"A deep dive into building my first neural network for stock price prediction, from data collection to model training and evaluation. Learn about the challenges and insights I gained as a CS student tackling real-world machine learning problems.",content:`# Building a Stock Prediction Neural Network as a Student

As a computer science student, I've always been fascinated by the intersection of finance and artificial intelligence. This project was my first serious foray into deep learning, and I wanted to share what I learned along the way.

## The Challenge

Predicting stock prices is notoriously difficult—even for professionals with decades of experience. The market is influenced by countless factors: economic indicators, company performance, global events, and even human psychology. So why attempt it as a student project?

The answer is simple: **learning by doing**. Building a stock prediction model forced me to understand:

- Data preprocessing and feature engineering
- Neural network architectures (LSTM, GRU, etc.)
- Time series analysis
- Model evaluation and validation
- The importance of realistic expectations

## Data Collection and Preprocessing

The first hurdle was gathering quality data. I used the Yahoo Finance API to collect historical stock prices, including:

- Open, High, Low, Close prices (OHLC)
- Volume
- Technical indicators (moving averages, RSI, MACD)

Preprocessing was crucial. I normalized the data, handled missing values, and created sequences for time series prediction. The key insight: **how you prepare your data often matters more than the model architecture**.

## Model Architecture

I experimented with several architectures:

1. **Simple LSTM**: A single LSTM layer with dropout
2. **Stacked LSTM**: Multiple LSTM layers for deeper learning
3. **GRU**: Gated Recurrent Units as an alternative to LSTM
4. **Hybrid**: Combining LSTM with convolutional layers

Each architecture taught me something different about how neural networks process sequential data.

## Results and Lessons Learned

Did my model beat the market? **No, and that's okay.** The real value was in the learning process:

- Understanding the limitations of predictive models
- Learning about overfitting and how to prevent it
- Gaining hands-on experience with TensorFlow/Keras
- Appreciating the complexity of financial markets

## Key Takeaways

1. **Start simple**: Begin with a basic model and iterate
2. **Data quality > Model complexity**: Clean, well-prepared data is essential
3. **Realistic expectations**: Stock prediction is extremely difficult
4. **Document everything**: Keep detailed notes on experiments and results

## Next Steps

I'm planning to explore:
- Ensemble methods combining multiple models
- Sentiment analysis from news articles
- Reinforcement learning approaches
- More sophisticated feature engineering

This project was just the beginning of my machine learning journey. The code is available on my GitHub, and I'd love to hear your thoughts or suggestions!

---

*Note: This project was for educational purposes only. Never use student projects for actual trading decisions.*`},{slug:"site-extractor-user-agent",title:"How I Built a Site Extractor That Acts Like a User Agent",subtitle:"Web Scraping with Respect and Intelligence",date:"2024-02-20",readingTime:"6 min read",tags:["Web Scraping","Python","Automation","Ethics"],excerpt:"Building a web scraper that respects robots.txt, mimics real browser behavior, and handles dynamic content. This post covers the technical challenges and ethical considerations of modern web scraping.",content:`# How I Built a Site Extractor That Acts Like a User Agent

Web scraping is a powerful tool, but it comes with responsibilities. In this project, I built a site extractor that not only works effectively but also respects website owners and their terms of service.

## The Problem

Many websites use anti-bot measures that block simple HTTP requests. They detect:
- Missing or suspicious User-Agent headers
- Unusual request patterns
- Lack of browser-like behavior
- JavaScript-rendered content that requires a real browser

## The Solution: A Respectful Scraper

My approach focused on three principles:

1. **Respect robots.txt**: Always check and honor robots.txt files
2. **Mimic real browsers**: Use proper headers, cookies, and request patterns
3. **Handle dynamic content**: Use headless browsers when necessary

## Technical Implementation

### Step 1: User-Agent Rotation

I created a pool of realistic user agents from actual browsers:

\`\`\`python
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    # ... more realistic agents
]
\`\`\`

### Step 2: Request Headers

A real browser sends many headers. I included:
- Accept-Language
- Accept-Encoding
- Referer
- Connection
- And more...

### Step 3: Rate Limiting

Respecting server resources is crucial. I implemented:
- Random delays between requests
- Exponential backoff on errors
- Respect for robots.txt crawl-delay directives

### Step 4: JavaScript Rendering

For sites with dynamic content, I used Selenium with a headless Chrome browser. This allows:
- Executing JavaScript
- Waiting for content to load
- Handling infinite scroll
- Taking screenshots for debugging

## Ethical Considerations

Web scraping exists in a gray area. I follow these guidelines:

1. **Check Terms of Service**: Always read and respect ToS
2. **Use robots.txt**: It's there for a reason
3. **Rate limiting**: Don't overwhelm servers
4. **Attribution**: Give credit when using scraped data
5. **Legal compliance**: Understand copyright and data protection laws

## Challenges Encountered

1. **CAPTCHAs**: Some sites use CAPTCHAs to block bots
2. **IP Blocking**: Too many requests can get your IP banned
3. **Dynamic Content**: JavaScript-heavy sites require headless browsers
4. **Legal Gray Areas**: Different jurisdictions have different rules

## Results

The scraper successfully:
- Extracts data from static and dynamic sites
- Respects robots.txt and rate limits
- Handles errors gracefully
- Provides clean, structured output

## Lessons Learned

1. **Ethics matter**: Always scrape responsibly
2. **Start simple**: Basic requests work for many sites
3. **Know when to use headless browsers**: They're slower but necessary for JS sites
4. **Error handling is critical**: Websites change, your code should adapt

## Conclusion

Building a respectful web scraper taught me as much about ethics and best practices as it did about technical implementation. The code is available on GitHub, and I'm always open to feedback and improvements.

---

*Remember: With great scraping power comes great responsibility. Always respect website owners and their terms of service.*`},{slug:"devlog-1-zombie-farm-unity",title:"Devlog #1: Zombie Farm-Style Mobile Game in Unity",subtitle:"Building My First Mobile Game from Scratch",date:"2024-03-10",readingTime:"10 min read",tags:["Unity","Game Development","C#","Mobile Games"],excerpt:"The first entry in my devlog series documenting the development of a mobile farming game with zombie elements. Learn about game design decisions, Unity architecture, and the challenges of mobile game development.",content:`# Devlog #1: Zombie Farm-Style Mobile Game in Unity

Welcome to the first devlog for my mobile game project! I'm building a farming game with a zombie twist—think Stardew Valley meets Plants vs. Zombies. This series will document my journey, challenges, and lessons learned.

## The Concept

The game combines:
- **Farming mechanics**: Plant crops, harvest resources, expand your farm
- **Zombie defense**: Protect your crops from zombie hordes
- **Resource management**: Balance farming, defense, and upgrades
- **Progression systems**: Unlock new crops, weapons, and farm upgrades

## Why Unity?

Unity was the natural choice for several reasons:
- Cross-platform support (iOS, Android, Web)
- Strong 2D tools and sprite management
- Large asset store and community
- C# scripting (familiar from other projects)
- Built-in mobile optimization tools

## Week 1: Project Setup and Core Systems

### Day 1-2: Project Structure

I started by setting up a clean project structure:

\`\`\`
Assets/
├── Scripts/
│   ├── Managers/
│   ├── Systems/
│   ├── UI/
│   └── Entities/
├── Sprites/
├── Prefabs/
└── Scenes/
\`\`\`

Organization is crucial for a project of this scope. I learned this the hard way in previous projects!

### Day 3-4: Grid System

The farm uses a grid-based system. I built a flexible grid manager that handles:
- Tile placement and validation
- Crop planting and growth
- Pathfinding for zombies
- Visual feedback

### Day 5-7: Crop System

Crops are the heart of the game. Each crop has:
- Growth stages (seedling → mature → harvestable)
- Growth time (real-time with offline progression)
- Resource yield
- Special properties (some crops repel zombies!)

## Technical Challenges

### Challenge 1: Save System

Mobile games need robust save systems. I implemented:
- JSON serialization for game state
- Cloud save integration (for future)
- Save data validation
- Backup and restore functionality

### Challenge 2: Performance

Mobile devices have limited resources. I optimized:
- Object pooling for frequently spawned objects
- Sprite atlasing to reduce draw calls
- LOD (Level of Detail) for distant objects
- Efficient pathfinding algorithms

### Challenge 3: Touch Controls

Mobile touch controls are different from mouse/keyboard. I created:
- Responsive touch input system
- Gesture recognition (tap, drag, pinch)
- Visual feedback for all interactions
- Accessibility options

## Game Design Decisions

### Decision 1: Real-Time vs. Turn-Based

I chose **real-time with pause** because:
- More engaging for mobile players
- Allows for skill-based gameplay
- Creates tension during zombie attacks

### Decision 2: Monetization Strategy

I'm planning a **premium model** (one-time purchase) because:
- No ads interrupting gameplay
- No pay-to-win mechanics
- Focus on game quality over monetization

### Decision 3: Art Style

I'm going with a **pixel art style** because:
- Timeless aesthetic
- Easier to create consistent assets
- Lower performance requirements
- Nostalgic appeal

## Current Progress

As of this devlog:
- ✅ Grid system implemented
- ✅ Basic crop system working
- ✅ Save/load functionality
- ✅ Touch input system
- 🚧 Zombie AI (in progress)
- 🚧 Combat system (planned)
- 🚧 UI/UX polish (planned)

## Next Steps

For the next devlog, I plan to cover:
- Zombie AI implementation
- Combat mechanics
- Sound design and music
- Playtesting and feedback

## Lessons Learned So Far

1. **Start with core systems**: Get the foundation right before adding features
2. **Mobile is different**: Touch controls and performance matter a lot
3. **Documentation helps**: Writing devlogs helps me reflect and plan
4. **Community feedback**: Sharing progress keeps me motivated

## Resources I'm Using

- Unity Learn tutorials
- Brackeys YouTube channel (RIP)
- Game Dev subreddits
- Asset packs from Unity Asset Store

Stay tuned for Devlog #2, where I'll dive into the zombie AI system!

---

*Follow my progress on GitHub or Twitter. Feedback and suggestions are always welcome!*`}];function n(){return[...a].sort((e,t)=>{const s=new Date(e.date).getTime();return new Date(t.date).getTime()-s})}function r(e){return a.find(t=>t.slug===e)}export{r as a,n as g};
