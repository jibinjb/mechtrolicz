export interface HackathonIdea {
  id: string;
  title: string;
  tagline: string;
  track: 'Campus & EdTech' | 'AI & Automation' | 'FinTech & Web3' | 'Health & MedTech' | 'Green & IoT' | 'Cyber & Trust';
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'Moonshot';
  innovationScore: number; // 0-100
  feasibilityScore: number; // 0-100
  judgeAppeal: number; // 0-100
  targetPrize: string;
  problemStatement: string;
  proposedSolution: string;
  systemArchitecture: {
    frontend: string;
    backend: string;
    aiOrService: string;
    database: string;
    infra: string;
  };
  recommendedSkills: string[];
  roleAssignments: {
    role: string;
    focus: string;
    superpower: string;
  }[];
  sprintMilestones: {
    phase: string;
    hours: string;
    deliverables: string[];
  }[];
  pitchDeckScript: {
    hook: string;
    problem: string;
    solution: string;
    liveDemo: string;
    marketAndImpact: string;
    closingAsk: string;
  };
  sampleRepoUrl: string;
}

export const HACKATHON_TRACKS = [
  'All Tracks',
  'Campus & EdTech',
  'AI & Automation',
  'FinTech & Web3',
  'Health & MedTech',
  'Green & IoT',
  'Cyber & Trust',
] as const;

export const INITIAL_HACKATHON_IDEAS: HackathonIdea[] = [
  {
    id: 'idea-campus-copilot',
    title: 'CampuSync — Multi-Modal Autonomous College Assistant',
    tagline: 'An agentic AI campus brain that synchronizes timetable clashes, mess menus, lab allocations, and peer doubt-solving in real time.',
    track: 'Campus & EdTech',
    difficulty: 'Intermediate',
    innovationScore: 94,
    feasibilityScore: 96,
    judgeAppeal: 92,
    targetPrize: 'Best Campus Innovation & $3,000 Grand Prize',
    problemStatement:
      'College students juggle fragmented portals: attendance on an ancient ERP, notices on Telegram, exam schedules on PDF, and club meetings on WhatsApp. Over 83% of students miss deadlines or lab slots due to decentralized notifications.',
    proposedSolution:
      'A liquid-glass progressive web app with a local vector memory that parses university syllabi, WhatsApp broadcast PDFs, and timetable spreadsheets into unified personal WhatsApp/web voice digests and one-click peer tutoring requests.',
    systemArchitecture: {
      frontend: 'React 19 + Tailwind CSS + Web Speech API (Voice Queries)',
      backend: 'FastAPI / Node.js + Firebase Authentication',
      aiOrService: 'LangChain + Local Embeddings + Gemini Flash 2.0 API',
      database: 'Cloud Firestore + Pinecone Vector Index',
      infra: 'Vercel Edge Functions + Supabase Storage for notice PDFs',
    },
    recommendedSkills: ['React', 'Python', 'Machine Learning', 'Firebase', 'UI/UX Design'],
    roleAssignments: [
      {
        role: 'AI / Pipeline Engineer',
        focus: 'PDF Notice Parser & Semantic Retrieval',
        superpower: 'Builds RAG pipeline parsing messy college admin circulars in <200ms',
      },
      {
        role: 'Frontend / UI Specialist',
        focus: 'Liquid Glass Dashboard & Voice Waveform Widget',
        superpower: 'Crafts responsive timetable grid and micro-interactions that wow judges',
      },
      {
        role: 'Backend / Auth Lead',
        focus: 'College ID parsing, Firestore sync & API endpoints',
        superpower: 'Ensures zero-latency token refreshing and encrypted student credential storage',
      },
      {
        role: 'Pitch & Product Lead',
        focus: 'Slide Deck, Demo Script & Live User Simulation',
        superpower: 'Delivers a punchy 3-minute pitch demonstrating real timetable clash resolution',
      },
    ],
    sprintMilestones: [
      {
        phase: 'Hour 00 - 06: Setup & Schema',
        hours: 'H0 - H6',
        deliverables: ['Scaffold Vite + React 19 app', 'Setup Firestore schema', 'Ingest 20 sample college notice PDFs'],
      },
      {
        phase: 'Hour 06 - 18: Core AI Engine',
        hours: 'H6 - H18',
        deliverables: ['Implement Gemini vector RAG pipeline', 'Build dynamic student schedule view', 'Connect voice-to-text queries'],
      },
      {
        phase: 'Hour 18 - 30: UI Polish & Live Data',
        hours: 'H18 - H30',
        deliverables: ['Add liquid-glass cards & dark mode accents', 'Build peer tutor matching widget', 'Test mobile responsiveness'],
      },
      {
        phase: 'Hour 30 - 36: Video & Pitch Rehearsal',
        hours: 'H30 - H36',
        deliverables: ['Record 90-second Loom walkthrough', 'Finalize 8-slide presentation deck', 'Rehearse live judge Q&A answers'],
      },
    ],
    pitchDeckScript: {
      hook: '"Judges, show of hands: how many times have you searched through 14 WhatsApp group chats just to find a single PDF notice about tomorrow morning’s rescheduled exam? In our college, that happens every single week."',
      problem: 'College administrative software is stuck in 2004. Notices are scattered, timetable clashes require manual academic office petitions, and students spend hours navigating fragmented portals.',
      solution: 'Introducing CampuSync. We turn every messy admin circular, timetable change, and mess menu update into an instantaneous personal AI agent on your phone.',
      liveDemo: '"Watch as I upload this real, messy 3-page college circular PDF. Within 1.8 seconds, CampuSync extracts that Lab Batch B has moved to Room 402, updates my personal calendar, and alerts my squad members."',
      marketAndImpact: 'Tested with 140 students across 3 departments this morning with a 98% resolution accuracy. Zero server setup required for new universities—drop your syllabus and go.',
      closingAsk: 'We are team CampuSync, uniting campus data so students can focus on learning. Thank you, and we welcome your questions!',
    },
    sampleRepoUrl: 'https://github.com/teamup/campus-sync-demo',
  },
  {
    id: 'idea-neuro-triage',
    title: 'NeuroScribe — Low-Resource Emergency Bed & Triage Balancer',
    tagline: 'Computer vision and edge LLM system for automated patient queue triage and district hospital emergency bed routing.',
    track: 'Health & MedTech',
    difficulty: 'Moonshot',
    innovationScore: 98,
    feasibilityScore: 89,
    judgeAppeal: 97,
    targetPrize: 'HealthTech Category Winner ($4,500 + Accelerator Invite)',
    problemStatement:
      'District hospitals in Tier-2/Tier-3 cities face severe overcrowding where emergency patients wait up to 4 hours for triage assessment, leading to preventable critical deteriorations.',
    proposedSolution:
      'A tablet-based triage assistant that combines real-time vital monitor optical scanning, vitals deterioration prediction, and inter-hospital bed allocation via lightweight edge models.',
    systemArchitecture: {
      frontend: 'React 19 + WebRTC + Camera Canvas Optical Stream',
      backend: 'Python FastAPI + WebSocket telemetry server',
      aiOrService: 'TensorFlow.js (local vitals OCR) + Med-PaLM/Gemini clinical summarizer',
      database: 'PostgreSQL / Cloud Firestore for live ward telemetry',
      infra: 'Docker containerized edge node for offline hospital LAN resilience',
    },
    recommendedSkills: ['Python', 'TensorFlow', 'React', 'Machine Learning', 'Data Science'],
    roleAssignments: [
      {
        role: 'Computer Vision Engineer',
        focus: 'Vital Monitor OCR & Patient Severity Scoring',
        superpower: 'Processes webcam feed to read SpO2, Pulse, and BP monitors without hardware cabling',
      },
      {
        role: 'Full Stack Web Lead',
        focus: 'Real-time Ward Dashboard & Bed Map',
        superpower: 'Builds live WebSocket bed grid showing color-coded patient urgency',
      },
      {
        role: 'Data Science & Metrics',
        focus: 'EHR Synthetic Dataset & Model Validation',
        superpower: 'Validates 96.4% triage classification accuracy on benchmark medical records',
      },
      {
        role: 'Product Architect & Presentation',
        focus: 'Clinical Flow Simulation & Pitch Deck',
        superpower: 'Brings stethoscopes and live pulse oximeter for an unforgettable judge demo',
      },
    ],
    sprintMilestones: [
      {
        phase: 'Hour 00 - 06: Data Model & Mock Feeds',
        hours: 'H0 - H6',
        deliverables: ['Scaffold vital stream generator', 'Set up triage severity state machine', 'Draft UI wireframes'],
      },
      {
        phase: 'Hour 06 - 18: OCR & Severity Engine',
        hours: 'H6 - H18',
        deliverables: ['Connect OpenCV/TF.js vital monitor reader', 'Build real-time patient queue sorting', 'Implement emergency alert audio'],
      },
      {
        phase: 'Hour 18 - 30: Multi-Ward Routing',
        hours: 'H18 - H30',
        deliverables: ['Inter-hospital transfer recommendation logic', 'Bed availability heat map', 'Doctor prescription audio recorder'],
      },
      {
        phase: 'Hour 30 - 36: Polishing & Stress Test',
        hours: 'H30 - H36',
        deliverables: ['Simulate 100 simultaneous emergency arrivals', 'Prepare pitch slides with clinical workflow diagrams', 'Rehearsal'],
      },
    ],
    pitchDeckScript: {
      hook: '"Every 42 seconds in high-density emergency wards, an unmonitored triage patient goes into cardiac shock while waiting in line. Today, we brought a device that changes that."',
      problem: 'Understaffed triage nurses must manually record 6 vitals per patient on paper clipboards while critical ambulances continue arriving without warning.',
      solution: 'NeuroScribe: Point any camera at existing ICU/triage monitors. In real time, it auto-extracts SpO2, Heart Rate, and Blood Pressure, computes a modified NEWS2 score, and auto-routes patients to open ICU beds.',
      liveDemo: '"Watch: our teammate wears this pulse oximeter. As his pulse simulates tachycardia, NeuroScribe instantly raises an Amber warning, reorders the queue, and sends a notification to the on-call doctor."',
      marketAndImpact: 'Over 12,000 community health centers in our country have monitors but no electronic EHR telemetry. NeuroScribe upgrades them instantly with zero extra sensors.',
      closingAsk: 'We are Team NeuroScribe, making intelligent healthcare accessible where every second counts. Thank you!',
    },
    sampleRepoUrl: 'https://github.com/teamup/neuro-scribe-triage',
  },
  {
    id: 'idea-micro-grant',
    title: 'ScholarPledge — Decentralized Peer-to-Peer Student Micro-Grants',
    tagline: 'Milestone-locked micro-endowments and hardware grants for student builders with transparent on-chain milestone escrow.',
    track: 'FinTech & Web3',
    difficulty: 'Intermediate',
    innovationScore: 91,
    feasibilityScore: 94,
    judgeAppeal: 93,
    targetPrize: 'Best Web3 / FinTech Social Good Prize ($2,500)',
    problemStatement:
      'Brilliant college engineering teams abandon hackathon projects and capstone hardware builds because they lack $50-$200 for Arduino boards, GPU cloud credits, or API tokens. Traditional college grants take 4 months of paperwork.',
    proposedSolution:
      'A transparent micro-funding protocol where alumni and sponsors fund student milestone escrows. Funds unlock automatically when GitHub pull requests or faculty mentor approvals are verified.',
    systemArchitecture: {
      frontend: 'React 19 + TypeScript + Ethers.js / Wagmi + Tailwind CSS',
      backend: 'Node.js + Express + GitHub Webhook Verifier',
      aiOrService: 'Smart Contracts (Solidity) on Polygon / Arbitrum testnet',
      database: 'Firestore for metadata + IPFS for proof-of-work deliverables',
      infra: 'Vercel + Alchemy RPC Provider',
    },
    recommendedSkills: ['Solidity', 'React', 'Node.js', 'TypeScript', 'Presentation & Pitching'],
    roleAssignments: [
      {
        role: 'Smart Contract Developer',
        focus: 'Escrow Vault & Multi-Sig Milestone Release',
        superpower: 'Writes gas-optimized Solidity escrow contract with automated refund protection',
      },
      {
        role: 'Frontend Web3 Architect',
        focus: 'Wallet Connection & Milestone Tracker UI',
        superpower: 'Designs glassmorphism dashboard showing funded milestones and instant claim buttons',
      },
      {
        role: 'Backend & GitHub Oracles',
        focus: 'PR Webhook Verification & IPFS Storage',
        superpower: 'Builds automated oracle triggering escrow payouts when GitHub milestone PR merges',
      },
      {
        role: 'Pitch & Tokenomics Specialist',
        focus: 'Alumni Engagement Model & Live Demo',
        superpower: 'Demonstrates 30-second live grant funding and automated claim transaction',
      },
    ],
    sprintMilestones: [
      {
        phase: 'Hour 00 - 06: Smart Contract Scaffold',
        hours: 'H0 - H6',
        deliverables: ['Write EscrowVault.sol', 'Deploy to Polygon Amoy testnet', 'Setup wagmi hooks'],
      },
      {
        phase: 'Hour 06 - 18: Frontend App & Wallet Connect',
        hours: 'H6 - H18',
        deliverables: ['Milestone visual progress bar', 'GitHub repository linking flow', 'Alumni donor portal'],
      },
      {
        phase: 'Hour 18 - 30: Oracle & Payout Testing',
        hours: 'H18 - H30',
        deliverables: ['Automated PR merge listener', 'Instant gasless token claim', 'Audit event history on block explorer'],
      },
      {
        phase: 'Hour 30 - 36: Demo Polish & Deck',
        hours: 'H30 - H36',
        deliverables: ['Prepare testnet wallet QR codes for judges', 'Record live testnet transaction', 'Slide deck'],
      },
    ],
    pitchDeckScript: {
      hook: '"Last semester, an engineering team at our college had to withdraw from a national robotics contest because they couldn’t afford a $45 motor controller before the weekend. Meanwhile, 10,000 alumni want to support student innovation but don’t want their money buried in university administrative bureaucracy."',
      problem: 'Small hardware and cloud credit bottlenecks kill promising student startups before they even graduate. Institutional grant cycles take months.',
      solution: 'ScholarPledge: Alumni back specific student milestones. When the student pushes the code and gets it verified, the funds release instantly to their UPI/wallet.',
      liveDemo: '"Watch on screen: Alumni Rahul pledges $50 for Milestone #2 (PCB Soldering). Our student submits the GitHub commit and photo proof. In one click, the smart contract unlocks the funds on-chain."',
      marketAndImpact: 'Over $40B is donated to higher education annually, yet less than 1% directly reaches student hands during active project building. ScholarPledge makes capital micro, transparent, and immediate.',
      closingAsk: 'Back student builders with zero red tape. We are ScholarPledge—empowering the next generation of creators!',
    },
    sampleRepoUrl: 'https://github.com/teamup/scholar-pledge-web3',
  },
  {
    id: 'idea-agentic-qa',
    title: 'AgentVerify — Autonomous Accessibility & Bug Hunting Swarm',
    tagline: 'Multi-agent browser automation swarm that audits student hackathon projects for WCAG accessibility, broken mobile layouts, and security vulnerabilities.',
    track: 'AI & Automation',
    difficulty: 'Intermediate',
    innovationScore: 96,
    feasibilityScore: 93,
    judgeAppeal: 95,
    targetPrize: 'Best AI / Developer Tooling Award ($3,500)',
    problemStatement:
      'Over 90% of hackathon projects fail final judging not because of bad code, but because judges try the app on an iPhone and the navigation button overflows or color contrast makes text unreadable.',
    proposedSolution:
      'A multi-agent testing suite where autonomous browser agents navigate any URL, test interactive forms, simulate color blindness, and generate automated GitHub Pull Requests fixing the styling glitches.',
    systemArchitecture: {
      frontend: 'React 19 + Liquid Glass Terminal + Recharts (Performance Telemetry)',
      backend: 'Node.js + Playwright Headless Browser Fleet',
      aiOrService: 'Gemini 2.5 Flash + Vision API for screenshot glitch detection',
      database: 'Cloud Firestore + S3 artifact storage for recorded traces',
      infra: 'Vite + Serverless Chromium on AWS Lambda',
    },
    recommendedSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'Machine Learning'],
    roleAssignments: [
      {
        role: 'Autonomous Agent Engineer',
        focus: 'Playwright Browser Automation & Heuristic Navigation',
        superpower: 'Builds autonomous crawler that fills forms, clicks buttons, and maps site DOM trees',
      },
      {
        role: 'Computer Vision & Glitch Detector',
        focus: 'Visual Regression & Layout Collision Detection',
        superpower: 'Uses Gemini Vision to detect overlapping text and bad contrast in real-time snapshots',
      },
      {
        role: 'Frontend UI/UX Designer',
        focus: 'Live Swarm Terminal & Interactive Heatmap Overlay',
        superpower: 'Creates cyberpunk-inspired liquid-glass agent console with real-time video playback',
      },
      {
        role: 'Developer Relations / Pitch Lead',
        focus: 'Live Judge Project Audit & Presentation',
        superpower: 'Runs the tool live during the pitch on the hackathon’s own submission website!',
      },
    ],
    sprintMilestones: [
      {
        phase: 'Hour 00 - 06: Headless Runner Scaffold',
        hours: 'H0 - H6',
        deliverables: ['Setup Playwright browser harness', 'Define accessibility audit criteria', 'UI shell'],
      },
      {
        phase: 'Hour 06 - 18: Agent Crawler & Vision API',
        hours: 'H6 - H18',
        deliverables: ['Connect Gemini Vision for UI bug detection', 'Generate automated CSS patch diffs', 'Stream live agent logs'],
      },
      {
        phase: 'Hour 18 - 30: GitHub Auto-PR Generator',
        hours: 'H18 - H30',
        deliverables: ['Create GitHub App integration', 'One-click Pull Request creation with bug screenshots', 'Export PDF audit report'],
      },
      {
        phase: 'Hour 30 - 36: Live Demo Prep',
        hours: 'H30 - H36',
        deliverables: ['Audit 5 popular hackathon websites', 'Rehearse live scan demo', 'Slide deck polish'],
      },
    ],
    pitchDeckScript: {
      hook: '"Hackathon teams spend 36 hours coding, only to lose points because their primary button is off-screen on the judge’s iPad. What if you had 5 automated QA engineers testing your app continuously while you sleep?"',
      problem: 'Developer teams never have time for rigorous accessibility and multi-viewport testing during hackathon crunches.',
      solution: 'AgentVerify: Paste your project URL. Our fleet of intelligent visual agents clicks through your user flows, identifies contrast failures and responsive breakages, and opens a GitHub Pull Request with the exact CSS fix.',
      liveDemo: '"Watch right now: I’m pasting the URL of a demo app. In 15 seconds, AgentVerify found an invisible submit button on mobile viewports, generated a Tailwind CSS fix, and here is the open Pull Request on GitHub!"',
      marketAndImpact: 'Essential tool for hackathons, startups, and developer bootcamps. Eliminates human QA bottlenecks with intelligent visual perception.',
      closingAsk: 'Never lose a competition to a broken button again. Build boldly with AgentVerify. Thank you!',
    },
    sampleRepoUrl: 'https://github.com/teamup/agent-verify-ai',
  },
  {
    id: 'idea-green-iot',
    title: 'EcoGrid — Peer-to-Peer Campus Energy Harvest & Solar Battery Swap',
    tagline: 'IoT sensor network and micro-economy trading excess student e-bike solar energy for campus cafeteria credits.',
    track: 'Green & IoT',
    difficulty: 'Intermediate',
    innovationScore: 92,
    feasibilityScore: 95,
    judgeAppeal: 91,
    targetPrize: 'Sustainability & CleanTech Grand Prize ($3,000)',
    problemStatement:
      'College campuses generate massive peak-hour carbon footprints through HVAC and lab power surges, while student e-bikes and solar battery banks sit fully charged and idle in parking lots.',
    proposedSolution:
      'An IoT hardware interface and mobile wallet allowing student e-bike batteries to inject power back into campus smart grids during peak surge periods in exchange for discounted cafeteria meals and book credits.',
    systemArchitecture: {
      frontend: 'React 19 + PWA + Chart.js Power Telemetry',
      backend: 'Node.js + MQTT Broker for IoT sensor packets',
      aiOrService: 'ESP32 microcontroller firmware + Peak-Demand Forecasting model',
      database: 'TimescaleDB / Cloud Firestore for time-series energy metrics',
      infra: 'Vercel + MQTT HiveMQ Cloud Broker',
    },
    recommendedSkills: ['IoT & Embedded', 'Python', 'React', 'Node.js', 'Firebase'],
    roleAssignments: [
      {
        role: 'Embedded & IoT Hardware Lead',
        focus: 'ESP32 Power Sensor & Relay Controller',
        superpower: 'Wires breadboard with current sensor (ACS712) and simulated solar cell input',
      },
      {
        role: 'Full Stack Web Developer',
        focus: 'Live Energy Grid Map & Campus Wallet',
        superpower: 'Builds interactive real-time wattage meters and meal token balance ledger',
      },
      {
        role: 'Predictive Energy Analyst',
        focus: 'Campus Surge Time Forecasting',
        superpower: 'Trains lightweight model predicting campus peak energy demand 2 hours in advance',
      },
      {
        role: 'Sustainability & Pitch Specialist',
        focus: 'Carbon Offset Metric Calculations & Demo',
        superpower: 'Demonstrates real wattage reduction with physical LED load and solar panel',
      },
    ],
    sprintMilestones: [
      {
        phase: 'Hour 00 - 06: Breadboard Setup & MQTT Broker',
        hours: 'H0 - H6',
        deliverables: ['Flash ESP32 with MQTT telemetry code', 'Connect to Cloud MQTT broker', 'Create web client listener'],
      },
      {
        phase: 'Hour 06 - 18: Dashboard & Real-Time Charts',
        hours: 'H6 - H18',
        deliverables: ['Real-time power generation graph', 'Token rewards computation algorithm', 'Campus heat map'],
      },
      {
        phase: 'Hour 18 - 30: Student Wallet & Cafeteria Integration',
        hours: 'H18 - H30',
        deliverables: ['QR code generation for meal redemption', 'Peak hour surge multiplier logic', 'Mobile polish'],
      },
      {
        phase: 'Hour 30 - 36: Hardware Enclosure & Pitch',
        hours: 'H30 - H36',
        deliverables: ['3D printed or acrylic hardware housing', 'Slide deck with campus energy cost projections', 'Practice'],
      },
    ],
    pitchDeckScript: {
      hook: '"Our college spends $42,000 every month on peak-demand energy surcharges. At the same time, 600 electric scooters and laptops sit plugged in, fully charged in the campus lots."',
      problem: 'Colleges lack decentralized micro-storage to cushion high-demand air conditioning and supercomputer lab power spikes.',
      solution: 'EcoGrid turns idle student lithium batteries into a distributed virtual power plant. Students plug into designated smart docks, sell back 15% charge during campus peak hours, and earn free lunch at the cafeteria.',
      liveDemo: '"Watch: This ESP32 measures power flowing from this battery pack. When campus demand peaks, the relay activates, power flows to the campus grid, and my phone immediately receives 40 EcoTokens redeemable right now."',
      marketAndImpact: 'Reduces campus peak grid draw by 14% while directly rewarding students for sustainable behavior. Scalable to corporate campuses and housing societies.',
      closingAsk: 'Turn idle batteries into campus energy resilience. We are Team EcoGrid!',
    },
    sampleRepoUrl: 'https://github.com/teamup/ecogrid-campus-iot',
  },
];
