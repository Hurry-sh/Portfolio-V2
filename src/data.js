export const socials = {
  github: "https://github.com/Hurry-sh",
  linkedin: "https://www.linkedin.com/in/harish-k-3b98b9317/",
  leetcode: "https://leetcode.com/u/Harish2904/",
  publication: "https://doi.org/10.1145/3726101.3726103",
};

export const metrics = [
  { value: "04", label: "industry + research roles" },
  { value: "09", label: "projects shipped" },
  { value: "01", label: "ACM publication" },
  { value: "6×", label: "distinction scholar" },
];

export const experience = [
  {
    id: "01",
    date: "JUL 2026 — NOW",
    role: "Software Engineer 1",
    place: "bigbasket · AI & Platforms",
    copy: "Building at the intersection of AI systems, data infrastructure, and platform engineering.",
    tags: ["AI platforms", "Platform engineering", "Software engineering"],
    active: true,
  },
  {
    id: "02",
    date: "JAN — JUL 2026",
    role: "Engineering Intern",
    place: "bigbasket · Data Engineering",
    copy: "Helped migrate Redshift workloads to an AWS data lake spanning 3B+ rows and 100+ Bronze/Silver assets, with 99.8% pipeline success.",
    tags: ["AWS data lake", "Spark + dbt", "3B+ rows"],
  },
  {
    id: "03",
    date: "JUN — JUL 2025",
    role: "Research Intern",
    place: "C3I",
    copy: "Modeled movement, temperature, and proximity signals from a wrist-worn device to distinguish BFRB-like gestures from everyday activity.",
    tags: ["Sensor fusion", "Classification", "Wearable data"],
  },
  {
    id: "04",
    date: "JUN — JUL 2024",
    role: "Research Intern",
    place: "CCNCS",
    copy: "Co-developed a hybrid Android malware detection approach that became a peer-reviewed ACM conference paper.",
    tags: ["CNN", "Grad-CAM", "Hybrid analysis"],
  },
  {
    id: "05",
    date: "AUG 2022 — JUL 2026",
    role: "B.Tech · Computer Science",
    place: "PES University",
    copy: "Built foundations across algorithms, networks, data systems, and machine learning, graduating with an 8.68 CGPA.",
    tags: ["Computer science", "8.68 CGPA", "Bengaluru"],
  },
];

export const projects = [
  {
    id: 1,
    title: "Recipe Generator",
    kicker: "GENERATIVE AI",
    category: "ml",
    description:
      "A generative recipe assistant that turns the ingredients already in your kitchen into practical meal ideas.",
    stack: ["Gemini API", "LLM", "Prompt design"],
    link: "https://github.com/Hurry-sh/Recipe-Generator-Using-GenAI",
    visual: "tokens",
    featured: true,
  },
  {
    id: 2,
    title: "Android Malware Detection",
    kicker: "PUBLISHED RESEARCH",
    category: "ml",
    description:
      "A two-stage malware detector combining API-call graphs, CNNs, Grad-CAM, and hybrid static + dynamic analysis.",
    stack: ["CNN", "Grad-CAM", "Cybersecurity"],
    link: "https://github.com/Hurry-sh/CCNCS-Project",
    visual: "radar",
    featured: true,
  },
  {
    id: 3,
    title: "Wearable Behavior Detection",
    kicker: "SENSOR FUSION",
    category: "ml",
    description:
      "A predictive model combining movement, temperature, and proximity signals to separate BFRB-like gestures from everyday actions.",
    stack: ["Sensor fusion", "Time series", "Classification"],
    link: "https://github.com/Hurry-sh/C3I_Internship_Project",
    visual: "network",
    featured: true,
  },
  {
    id: 4,
    title: "Distributed File Server",
    kicker: "BIG DATA SYSTEMS",
    category: "data",
    description:
      "Distributed file orchestration and synchronization designed around coordination, replication, and resilient transfer.",
    stack: ["Distributed systems", "Big data", "Networking"],
    link: null,
    visual: "blocks",
  },
  {
    id: 5,
    title: "CNN Image Classifier",
    kicker: "COMPUTER VISION",
    category: "ml",
    description:
      "A convolutional neural network trained to distinguish cats from dogs through learned visual features.",
    stack: ["CNN", "Deep learning", "Computer vision"],
    link: "https://github.com/Hurry-sh/CNN-Image-Classifier",
    visual: "ann",
  },
  {
    id: 6,
    title: "Handwriting Recognition",
    kicker: "DEEP LEARNING",
    category: "ml",
    description:
      "A neural recognition experiment that translates handwritten inputs into machine-readable predictions.",
    stack: ["CNN", "Character recognition", "Vision"],
    link: "https://github.com/Hurry-sh/Hand-Writing-Recognition",
    visual: "digits",
  },
  {
    id: 7,
    title: "Time Server",
    kicker: "COMPUTER NETWORKS",
    category: "data",
    description:
      "A client-server networking project exploring reliable communication through socket programming.",
    stack: ["Sockets", "Networking", "Client/server"],
    link: "https://github.com/Hurry-sh/Time-Server-Socket-Programming",
    visual: "clock",
  },
  {
    id: 8,
    title: "PESU Web Experience",
    kicker: "WEB ENGINEERING",
    category: "web",
    description:
      "A university-focused web experience built to make institutional information easier to navigate.",
    stack: ["React", "UI", "Web"],
    link: "https://github.com/Hurry-sh/PESU-Website-Development",
    visual: "window",
  },
  {
    id: 9,
    title: "Portfolio v1",
    kicker: "ORIGIN STORY",
    category: "web",
    description:
      "The first portfolio iteration—and the baseline this new data-native experience evolves from.",
    stack: ["React", "CSS", "GitHub Pages"],
    link: "https://github.com/Hurry-sh/Portfolio",
    visual: "cursor",
  },
];

export const skillGroups = [
  {
    label: "01 / DATA SYSTEMS",
    title: "Move it reliably",
    dense: true,
    skills: [
      "Python",
      "SQL",
      "PySpark",
      "PyFlink",
      "Kafka",
      "Airflow",
      "dbt",
      "Apache Iceberg",
      "Apache Parquet",
      "Amazon S3",
      "Amazon Athena",
      "Amazon Redshift",
      "Amazon EMR",
      "Amazon EC2",
      "AWS DMS",
    ],
  },
  {
    label: "02 / MACHINE LEARNING",
    title: "Teach it patterns",
    skills: ["TensorFlow", "Keras", "NumPy", "Pandas", "ONNX", "Amazon SageMaker"],
  },
];

export const tickerItems = [
  "DATA PIPELINES",
  "FEATURE ENGINEERING",
  "APPLIED ML",
  "DISTRIBUTED SYSTEMS",
  "MODEL SERVING",
  "RESEARCH",
];
