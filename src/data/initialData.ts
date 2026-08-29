import { Project, JournalEntry, StatItem, PortfolioConfig } from '../types';

export const INITIAL_CONFIG: PortfolioConfig = {
  name: 'Jibin Johny',
  eyebrow: "Hello, I'm",
  roles: ['Programmer', 'Analyst', 'Translator', 'Innovator'],
  location: 'Kerala',
  bio: 'I blend full-stack development experience with Machine Learning and GenAI to transform complex backend data into clean, intuitive, and user-friendly visual insights.',
  profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
  email: 'jibinpjohnyy@gmail.com',
  resumeUrl: 'https://raw.githubusercontent.com/JBN0011/JBN0011/main/resume.pdf',
  resumeFileName: 'Jibin_Johny_Resume.pdf',
  availableForWork: true,
  socials: {
    instagram: 'https://www.instagram.com/jiiib.in/',
    linkedin: 'https://www.linkedin.com/in/jibin-p-johny/',
    leetcode: 'https://leetcode.com/u/jibinpjohny000/',
    github: 'https://github.com/JBN0011',
  },
  adminPasscode: 'admin123',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'automotive-motion',
    title: 'Automotive Motion',
    category: 'Telemetry & Visualization',
    spanSize: 7,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    description: 'High-frequency telemetry stream visualizer for electric vehicles with sub-16ms WebGL rendering and predictive powertrain thermal degradation analysis.',
    projectUrl: 'https://github.com/JBN0011',
    githubUrl: 'https://github.com/JBN0011/automotive-motion',
    featured: true,
    tags: ['React', 'WebGL', 'TypeScript', 'WebSockets', 'Python'],
    year: '2025',
  },
  {
    id: 'urban-architecture',
    title: 'Urban Architecture',
    category: 'Spatial Design & Generative AI',
    spanSize: 5,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description: 'Algorithmic zoning optimization platform translating city ordinance PDFs into 3D parametric envelope simulations using multimodal LLM pipelines.',
    projectUrl: 'https://github.com/JBN0011',
    githubUrl: 'https://github.com/JBN0011/urban-architecture',
    featured: true,
    tags: ['Three.js', 'FastAPI', 'GenAI', 'Tailwind CSS'],
    year: '2025',
  },
  {
    id: 'human-perspective',
    title: 'Human Perspective',
    category: 'Computer Vision & Health',
    spanSize: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    description: 'Real-time ergonomic posture tracking and micro-expression fatigue detection utilizing edge-accelerated OpenCV neural filters in browser runtimes.',
    projectUrl: 'https://github.com/JBN0011',
    githubUrl: 'https://github.com/JBN0011/human-perspective',
    featured: true,
    tags: ['Computer Vision', 'TensorFlow.js', 'React', 'Tailwind'],
    year: '2024',
  },
  {
    id: 'brand-identity',
    title: 'Brand Identity',
    category: 'Design Systems & Motion',
    spanSize: 7,
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    description: 'Strict monochrome design system engine with automated contrast audits, fluid typographic scale generators, and GSAP micro-interaction libraries.',
    projectUrl: 'https://github.com/JBN0011',
    githubUrl: 'https://github.com/JBN0011/brand-identity-system',
    featured: true,
    tags: ['Design Systems', 'GSAP', 'TypeScript', 'Figma API'],
    year: '2024',
  },
  {
    id: 'neural-flow',
    title: 'Neural Flow',
    category: 'Machine Learning',
    spanSize: 7,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    description: 'Interactive attention weight visualizer for transformer architectures, decomposing multi-head token activations in real-time.',
    projectUrl: 'https://github.com/JBN0011',
    githubUrl: 'https://github.com/JBN0011',
    featured: false,
    tags: ['PyTorch', 'React', 'D3.js', 'FastAPI'],
    year: '2024',
  },
  {
    id: 'algorithmic-trading-terminal',
    title: 'Quant Matrix',
    category: 'Financial Engineering',
    spanSize: 5,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    description: 'Sub-millisecond orderbook heatmaps and algorithmic backtesting engine with statistical arbitrage signal generation.',
    projectUrl: 'https://github.com/JBN0011',
    githubUrl: 'https://github.com/JBN0011',
    featured: false,
    tags: ['C++', 'Rust', 'TypeScript', 'WebAssembly'],
    year: '2024',
  }
];

export const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: '1',
    title: 'Designing with Intentional Monochrome: The Power of Strict Black & White',
    date: 'Aug 24, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    summary: 'Why removing color forces a deeper emphasis on contrast ratios, typographic step hierarchies, and mathematical negative space.',
    content: `When color is stripped away from an interface, every single typographic decision, spatial alignment, and shadow step is magnified under direct scrutiny.

In conventional product design, colors like vibrant blues and emerald greens often act as crutches to signal urgency or establish visual weight. But in an absolute monochrome system—where the palette is restricted purely to HSL pure black, 4% near-black surfaces, 15% dark gray structural strokes, and pure white accents—hierarchy must be established through mathematical typographic scale, line-height discipline, and deliberate contrast.

### 1. The Geometry of Negative Space
Negative space is not empty space; it is active breathing room. Container outer padding must always equal or exceed the inner padding between its child elements. When layout rhythm aligns with harmonic step ratios, content naturally feels balanced without decorative noise.

### 2. Optical Weight Over Arbitrary Tinting
By varying stroke weight (from 1px hair lines to 2px structural frames) and leveraging subtle blur filters (such as 12px backdrop blurs over halftone textures), we achieve depth that feels architectural rather than artificial.`,
    slug: 'designing-with-intentional-monochrome',
    tags: ['Design', 'Monochrome', 'Typography'],
  },
  {
    id: '2',
    title: 'The Intersection of GenAI and Front-End Interface Design',
    date: 'Jul 18, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    summary: 'Bridging high-latency neural inference pipelines with optimistic UI updates and deterministic visual feedback.',
    content: `Machine learning models are non-deterministic, probabilistic, and often latency-heavy. Front-end web development, on the other hand, prioritizes instant 60fps responsiveness and deterministic state transitions.

How do we reconcile these two diametrically opposed worlds?

### The Philosophy of Optimistic Neural UI
1. **Perceptual Speed**: Stream token outputs using reactive SSE channels with chunked buffer smoothing instead of waiting for full payload resolution.
2. **Confidence Intervals as Micro-UI**: Render uncertainty visually—displaying confidence scores with discrete bar graphs and toggleable inference debuggers.
3. **Graceful Fallbacks**: When edge neural nodes fail or exceed latency budgets, fall back seamlessly to deterministic rule-based algorithms without halting user workflows.`,
    slug: 'intersection-of-genai-and-front-end',
    tags: ['GenAI', 'Machine Learning', 'UX Engineering'],
  },
  {
    id: '3',
    title: 'Architecting Scalable React State with Custom Hooks & Context',
    date: 'Jun 05, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    summary: 'Best practices for organizing client-side persistence, avoiding unnecessary re-renders, and maintaining predictable data flow.',
    content: `State management in React often oscillates between over-engineering (massive monolithic stores) and chaos (scattered prop drilling).

A disciplined approach combines localized component state, compound hooks, and partitioned context providers. By isolating high-frequency UI state (like scroll positions and mouse coordinates) from global persistence state (like projects and content metadata), we ensure optimal rendering performance and zero layout thrashing.`,
    slug: 'architecting-scalable-react-state',
    tags: ['React', 'TypeScript', 'Architecture'],
  },
  {
    id: '4',
    title: 'Scroll-Driven Motion Engineering: Harmonizing GSAP & Framer Motion',
    date: 'May 12, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    summary: 'Combining the power of GSAP ScrollTrigger for scrubbed timelines with Framer Motion for declarative route transitions.',
    content: `Both GSAP and Framer Motion excel in modern web animation, but each has distinct strengths:

- **GSAP ScrollTrigger**: Ideal for complex scrubbed timelines, parallax layers, multi-stage pin transitions, and continuous infinite marquees.
- **Framer Motion**: Unmatched for declarative component entry/exit, layout transitions, and AnimatePresence route orchestration.

By assigning continuous scroll mechanics to GSAP and route transitions/interactive state animations to Framer Motion, we achieve high-fidelity 60fps visuals with clean separation of concerns.`,
    slug: 'scroll-driven-motion-engineering',
    tags: ['GSAP', 'Framer Motion', 'Animation'],
  },
];

export const INITIAL_STATS: StatItem[] = [
  {
    id: 'stat-1',
    number: 3,
    suffix: '+',
    label: 'Months Industry Experience',
    description: 'Accelerated production contributions across full-stack systems and ML pipelines.',
  },
  {
    id: 'stat-2',
    number: 5,
    suffix: '+',
    label: 'Projects Done',
    description: 'Production-ready full-stack applications and AI-driven interactive platforms.',
  },
  {
    id: 'stat-3',
    number: 17,
    suffix: '+',
    label: 'Tech Stack Tools Mastered',
    description: 'Python, SQL, Power BI, Tableau, Pandas, NumPy, Matplotlib, Seaborn, Kotlin, JavaScript, C, HTML, CSS, React.js, Bootstrap, Material-UI, MySQL Shell',
  },
];
