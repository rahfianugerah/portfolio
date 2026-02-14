import { Icons } from "@/components/icons";
import { FaBusinessTime } from "react-icons/fa";
import { TbCertificate } from "react-icons/tb";
import { HomeIcon, NotebookIcon, TerminalIcon, MailIcon } from "lucide-react";
import { time } from "console";

export const DATA = {
  name: "Naufal Rahfi Anugerah",
  initials: "R",
  url: "https://rahfi.pro",
  location: "Jakarta, Indonesia",
  locationLink: "https://www.google.com/maps/place/jakarta",
  description: "AI Software Engineer",
  summary: "I am an AI Software Engineer and recent Computer Science graduate, majoring in Information Systems from Mercu Buana University who loves bridging the gap between complex tech and real business value. My expertise lies at the intersection of AI and Cloud Computing, where I focus on taking from experimental AI models and turning them into production-ready systems. As a generalist with a product-first mindset, I care deeply about code quality and scalable architecture, and I am eager to apply my skills in AI and Cloud to collaborate on meaningful, high-impact projects",
  avatarUrl: "",
  programmingLanguages: [
    "Python",
    "JavaScript",
    "TypeScript",
    "Bash"
  ],
  frameworks: [
    "TensorFlow",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "Flask",
    "FastAPI",
    "Next.js",
    "React",
    "Node.js",
    "Tailwind CSS",
    "Bootstrap",
  ],
  databases: [
    "MySQL",
    "SQLite",
    "PostgreSQL",
  ],
  tools: [
    "Docker",
    "AWS",
    "Google Cloud",
    "Azure",
    "Git",
    "GitHub",
    "Postman",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/experience", icon: FaBusinessTime, label: "Experience" },
    { href: "/project", icon: TerminalIcon, label: "Project" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
    { href: "/contact", icon: MailIcon, label: "Contact" },
  ],
  contact: {
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/rahfianugerah",
        icon: Icons.github,
        navbar: true,
      },
      CV: {
        name: "CV",
        url: "https://drive.google.com/file/d/1aDMypG0tqlbVuBAMR_Fc2ZQ5Bxz34LSe/view?usp=sharing",
        icon: Icons.file,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/rahfianugerah/",
        icon: Icons.linkedin,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "PT Arsa Muda Nawasena",
      href: "#",
      badges: [],
      location: "Tangerang Selatan, Indonesia",
      title: "AI Software Engineer",
      logoUrl: "/amn-exp.png",
      start: "Sep 2025",
      end: "Present",
      description: [
        "Streamlined operations by engineering a centralized full-stack platform to replace manual property tracking.",
        "Eliminated response delays by deploying an NLP-powered chatbot to handle customer inquiries 24/7.",
        "Modernized data management by designing robust backend architecture and RESTful APIs for internal tools."
      ],
    },
    {
      company: "PT Arsa Muda Nawasena",
      href: "#",
      badges: [],
      location: "Tangerang Selatan, Indonesia",
      title: "Co-Founder",
      logoUrl: "/amn-exp.png",
      start: "Sep 2025",
      end: "Present",
      description: [
        "Establish and build the property agency (PT), including legal setup and early business operations for real estate agency.",
        "Define and oversee the company’s strategic direction in information technology and digital transformation.",
        "Lead the development and implementation of technology solutions to enhance operational efficiency and customer experience."
      ],
    },
    {
      company: "Asah led by Dicoding in association with Accenture",
      href: "#",
      badges: ["Remote", "Machine Learning", "Cohort"],
      location: "Jakarta, Indonesia",
      title: "Machine Learning Cohort",
      logoUrl: "/asah-exp.png",
      start: "Aug 2025",
      end: "Jan 2026",
      description: [
        "Won 'Best Capstone Project' (96/100) by leading the development of the AEGIS predictive maintenance system.",
        "Secured a top-tier scholarship (1 of 2,000) by demonstrating strong commitment to AI innovation during screening.",
        "Designed a predictive maintenance system capable of reducing inspection times by 20% through voice-activated reporting."
      ],
    },
    {
      company: "Dicoding Indonesia",
      href: "#",
      badges: ["Remote", "Freelance", "Code Review", "Mentor", "Machine Learning", "Google Cloud"],
      location: "Jakarta, Indonesia",
      title: "External Academy Code Reviewer",
      logoUrl: "/dicoding-exp.jpeg",
      start: "Mar 2025",
      end: "Present",
      description: [
        "Achieved a 4.9/5 rating from 200+ students by providing detailed feedback on code logic and industry standards.",
        "Safeguarded educational quality by evaluating complex Data Science, ML, DL, GenAI and Cloud projects against strict curriculum rubrics.",
        "Accelerated learner proficiency by rigorously auditing project logic and documentation for deployment readiness."
      ],
    },
    {
      company: "Dicoding Indonesia",
      href: "#",
      badges: ["Student", "Machine Learning"],
      location: "Jakarta, Indonesia",
      title: "Machine Learning Student",
      logoUrl: "/dicoding-exp.jpeg",
      start: "April 2024",
      end: "Aug 2024",
      description: [
        "Studied and implemented key machine learning fundamentals, including supervised, unsupervised learning and deep learning expertise through practical application of neural networks, CNN, RNN, and LSTM.",
        "Built and deployed multiple end-to-end projects in domains such as Time series forecasting, Image classification, Text classification and Natural Language Processing (NLP), Regression analysis, Clustering and pattern recognition, Predictive modeling and business intelligence.",
        "Gained hands-on experience with model deployment, monitoring, and ML pipeline automation."
      ],
    },
    {
      company: "Samsung Innovation Campus Batch 6",
      badges: ["Remote", "Trainee", "Artificial Intelligence", "IoT"],
      href: "#",
      location: "Jakarta, Indonesia",
      title: "AI & IoT Development Trainee",
      logoUrl: "/sic-exp.jpg",
      start: "Jan 2025",
      end: "Feb 2025",
      description: [
        "Exploring various microcontrollers, including ESP32, to understand their capabilities and applications.",
        "Designing and building IoT kit devices to develop practical and innovative solutions.",
        "Applying design thinking principles to create user-centric IoT solutions that address real-world challenges."
      ],
    },
    {
      company: "Bangkit Academy 2024 Batch 2 - Bangkit led by Google, Goto and Traveloka",
      href: "#",
      badges: ["Remote", "Cloud Computing", "Cohort"],
      location: "Jakarta, Indonesia",
      title: "Cloud Computing Cohort",
      logoUrl: "/bangkit-exp.jpg",
      start: "Aug 2024",
      end: "Jan 2025",
      description: [
        "Attained 'Distinction' (Top 10% of cohort) by mastering the lifecycle of scalable cloud infrastructure on Google Cloud Platform (GCP).",
        "Engineered functional mobile ecosystems by integrating front-end interfaces with robust RESTful APIs, ensuring seamless data flow.",
        "Operationalized ML models for production by designing high-availability GCP cloud architectures capable of auto-scaling."
      ],
    },
    {
      company: "Computer Laboratory Assistant Faculty of Computer Science, Mercu Buana University",
      href: "#",
      badges: ["Part-Time", "On-Site", "Back-End Development", "Mentor", "RESTful API Development"],
      location: "Jakarta, Indonesia",
      title: "Back-End Research and Development Associate",
      logoUrl: "/aslab-exp.jpg",
      start: "Jan 2024",
      end: "Feb 2025",
      description: [
        "Accelerated skill acquisition for 5+ laboratory assistant by orchestrating end-to-end curriculum design for the Back-End learning path.",
        "Resolved complex technical challenges by directing regular one-on-one and group mentoring sessions, resulting in a 20% increase in project completion rates.",
        "Promoted practical engineering principles by streamlining project coordination, reducing setup time for laboratory members by 20%."
      ],
    },
    {
      company: "Computer Laboratory Assistant Faculty of Computer Science, Mercu Buana University",
      href: "#",
      badges: ["Part-Time", "On-Site"],
      location: "Jakarta, Indonesia",
      title: "Sr. Computer Laboratory Assistant",
      logoUrl: "",
      start: "Jan 2024",
      end: "Feb 2025",
      description: [
        "Guaranteed 100% operational uptime during classes by proactively resolving 20+ critical software and hardware issues weekly.",
        "Enforced high performance standards by mentoring 5+ new laboratory assistants on protocols, reducing onboarding time by 50%.",
        "Optimized lab efficiency by implementing collaborative best practices, resulting in a zero-downtime record for the semester."
      ],
    },
    {
      company: "Computer Laboratory Assistant Faculty of Computer Science, Mercu Buana University",
      href: "#",
      badges: ["Part-Time", "On-Site"],
      location: "Jakarta, Indonesia",
      title: "Jr. Computer Laboratory Assistant",
      logoUrl: "",
      start: "Apr 2023",
      end: "Jan 2024",
      description: [
        "Administered hardware readiness by executing regular software updates, backups, and preventive maintenance for 30+ workstations.",
        "Coordinated seamless academic delivery by configuring technical environments for lecturers pre-session, resulting in zero delays for practical exams.",
        "Minimized downtime during practical classes by resolving hardware and software malfunctions in real-time."
      ],
    },
    {
      company: "Google Developer Student Club, Mercu Buana University",
      href: "#",
      badges: ["Hybrid", "Community"],
      location: "Jakarta, Indonesia",
      title: "GDSC Member",
      logoUrl: "/gdsc-exp.jpg",
      start: "Dec 2023",
      end: "Oct 2024",
      description: [
        "Expanded technical proficiency in Google Developer technologies including Firebase and Google Cloud by completing multiple hands-on workshops, bridging the gap between theoretical coursework and practical implementation.",
        "Accelerated project development cycles by collaborating with a multidisciplinary team of student developers to share best practices and troubleshoot complex code during community build sessions.",
        "Increased personal professional network by 10+ within the local tech ecosystem by actively organizing and participating in networking events to foster cross-functional collaboration."
      ],
    },
    {
      company: "Digital Talent Scholarship",
      href: "#",
      badges: ["Remote", "AWS", "Trainee"],
      location: "Jakarta, Indonesia",
      title: "AWS Engineer Trainee",
      logoUrl: "/dts-exp.jpg",
      start: "Feb 2024",
      end: "Mar 2024",
      description: [
        "Successfully achieved the AWS Certified Cloud Practitioner (CLF-C02) certification, validating foundational knowledge of cloud fluency and AWS security/compliance by scoring 733 on the international proctored exam.",
        "Optimized cloud infrastructure scalability and cost-efficiency for simulated enterprise workloads, by designing AWS architectures including: EC2, S3, and RDS in alignment with the AWS Well-Architected Framework.",
        "Reduced potential system downtime in architecture simulations by implementing AWS best practices for high availability and fault tolerance across multiple Availability Zones (AZs)."
      ],
    },
  ],
  education: [
    {
      school: "Mercu Buana University",
      href: "https://mercubuana.ac.id",
      degree: "Bachelor's Degree of Computer Science",
      logoUrl: "/umb-edu.jpg",
      start: "2022",
      end: "2026",
      description: [
        "GPA: 3.88/4.00",
        "Study Range: 2022 - 2026 (3.5/4 Years)",
        "Completed the full undergraduate curriculum in an accelerated 3.5-year timeline, demonstrating exceptional academic discipline and time management.",
        "Authored the thesis: Optimizing Stroke Risk Prediction Using Artificial Neural Network with Selected Feature Based on Binary Particle Swarm Optimization.",
      ],
    },
    {
      school: "Asah led by Dicoding in association with Accenture",
      href: "https://www.dicoding.com",
      degree: "Non-Degree Program in Machine Learning - Machine Learning Cohort",
      logoUrl: "/asah-exp.png",
      start: "Aug 2025",
      end: "Jan 2026",
      description: [
        "Awarded \"Best Capstone Project\" (93/100) by leading the development of AEGIS, an AI-powered maintenance copilot.",
        "Selected as 1 of 2,000 scholars by demonstrating high potential in the end-to-end Machine Learning lifecycle.",
        "Developed a hands-free maintenance advisor by integrating NLP and Voice-Command features for field engineers."
      ],
    },
    {
      school: "Bangkit Academy 2024 Batch 2 - Bangkit led by Google, Goto and Traveloka",
      href: "https://grow.google/intl/id_id/bangkit/?tab=cloud-computing",
      degree: "Non-Degree Program in Cloud Computing - Cloud Computing Cohort",
      logoUrl: "/bangkit-exp.jpg",
      start: "Aug 2024",
      end: "Jan 2025",
      description: [
        "Secured a position in this elite career accelerator, selected from a competitive pool of over 45,000 registrants.",
        "Graduated with Distinction (Top 10% of cohort) in the Cloud Computing learning path, mastering the deployment and security of scalable infrastructure on Google Cloud Platform (GCP)"
      ],
    },
  ],
  leadership: [
    {
      company: "Asah led by Dicoding in association with Accenture",
      href: "#",
      badges: ["Remote", "Machine Learning", "Cohort", "Project Lead", "Modeling", "AI Engineering"],
      location: "Jakarta, Indonesia",
      title: "Capstone Project Manager",
      logoUrl: "/asah-exp.png",
      start: "Oct 2025",
      end: "Jan 2026",
      description: [
        "Successfully led a team to complete the AEGIS predictive maintenance application project on schedule.",
        "Efficiently guided team members to align with project timelines and deliverables.",
        "Won 'Best Capstone Project' validated by the owner use case (Accenture) for leading the development of the AEGIS predictive maintenance system.",
      ],
    },
    {
      company: "Mercu Buana University",
      href: "#",
      badges: ["Full-Time", "Project Lead", "Back-End Engineering", "Cloud Engineering", "AI Engineering"],
      location: "Jakarta, Indonesia",
      title: "Project Manager - Information Systems Development Project",
      logoUrl: "/umb-edu.jpg",
      start: "Mar 2025",
      end: "Jul 2025",
      description: [
        "Successfully created an AI-powered HR interview mobile application integrating both voice and chat features to enhance candidate evaluation.",
        "Designed and implemented interactive modules to simulate real interview scenarios with AI-driven responses.",
        "Successfully won the National Innovation Exhibition Gold Medal, showcasing innovation and practical impact of the solution."
      ],
    },
    {
      company: "Samsung Innovation Campus Batch 6",
      href: "#",
      badges: ["Project Lead"],
      location: "Jakarta, Indonesia",
      title: "Project Team Lead",
      logoUrl: "/sic-exp.jpg",
      start: "Jan 2025",
      end: "Feb 2025",
      description: [
        "Led a team in the Samsung Innovation Campus program to develop an IoT-based application project using Ubidots and Flask.",
        "Provided technical and team support to maintain smooth project execution and integration of IoT devices.",
        "Achieved Stage 2 out of 4 in the program, demonstrating strong leadership and practical application of IoT solutions despite challenges."
      ],
    },
    {
      company: "Bangkit Academy 2024 Batch 2 - Bangkit led by Google, Goto and Traveloka",
      href: "#",
      badges: ["Remote", "Cloud Computing", "Cohort", "Project Lead", "Back-End Engineering", "Cloud Engineering"],
      location: "Jakarta, Indonesia",
      title: "Capstone Project Manager",
      logoUrl: "/bangkit-exp.jpg",
      start: "Nov 2024",
      end: "Dec 2024",
      description: [
        "Successfully led a team to complete application projects on schedule.",
        "Efficiently guided team members to align with project timelines and deliverables.",
        "Provided continuous support to team members to ensure smooth project execution.",
      ],
    },

  ],
  projects: [
    {
      title: "rahfi.pro",
      href: "https://rahfi.pro",
      status: "Maintained",
      description:
        "A personal portfolio website showcasing my experiences, educations, skills, projects, achievements and writings. Built with Next.js and Tailwind CSS.",
      technologies: [
        "Next.js",
        "Typescript",
        "TailwindCSS",
        "Stripe",
        "Shadcn UI",
        "Magic UI",
        "Radix UI",
        "Vercel",
        "Sanity.io CMS",
        "Supabase",
        "PostgreSQL",
      ],
      links: [
        {
          type: "Website",
          href: "https://rahfi.pro",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source Code",
          href: "https://github.com/rahfianugerah/portfolio",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/rahfipro.png",
      video: "",

    },
    {
      title: "AEGIS: AI Engine for Grounded Inspection System - Accenture Use Case",
      href: "https://github.com/A25-CS046",
      status: "Maintained",
      description:
        "AEGIS (AI Engine for Grounded Inspection System) is an intelligent predictive-maintenance platform designed to transform traditional reactive maintenance into a data-driven, adaptive, and automated system. The project leverages machine learning, real-time sensor analytics, and Agentic AI to detect anomalies, predict equipment failures, and recommend optimal maintenance schedules across industrial sectors such as energy, mining, and manufacturing. By closing the gap between abundant sensor data and actionable insights, AEGIS enables industries to reduce downtime, enhance safety, and improve operational sustainability.",
      technologies: [
        "Python",
        "Flask",
        "LangChain",
        "Gemini LLM 2.5 Pro",
        "XgBoost",
        "DaisyUI",
        "Drizzle",
        "TailwindCSS",
        "Radix UI",
        "PostgreSQL",
        "Express.js",
        "Node.js",
        "GCP",
        "Docker",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/A25-CS046",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/aegis-project.png",
      video: "",
    },
    {
      title: "SATRIA: System for Analyzing Total Risk of Agent & Group (Sistem Analisis Terpadu Risiko Agen & Grup)",
      href: "https://github.com/anggara-26/satria-pika-pika",
      status: "Maintained",
      description:
        "SATRIA is an AI-based early warning system designed specifically for microfinance risk operations. It integrates field agent performance analysis and borrower group health to detect potential default risks early.",
      technologies: [
        "Golang",
        "Vite.js",
        "TypeScript",
        "Gemini LLM",
        "TailwindCSS",
        "GCP",
        "Docker",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/anggara-26/satria-pika-pika",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/satria-final.png",
      video: "",
    },
    {
      title: "SATRIA: System for Analyzing Total Risk of Agent & Group (Sistem Analisis Terpadu Risiko Agen & Grup) - Prototype",
      href: "https://github.com/anggara-26/satria",
      status: "Maintained",
      description:
        "SATRIA is an AI-based early warning system designed specifically for microfinance risk operations. It integrates field agent performance analysis and borrower group health to detect potential default risks early.",
      technologies: [
        "Golang",
        "Vite.js",
        "TypeScript",
        "Gemini LLM",
        "TailwindCSS",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/anggara-26/satria",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/satria-prototype.png",
      video: "",
    },

    {
      title: "Stacked Pretrained Models Pipeline for Javanese Scripts (Aksara Jawa) Handwritten Character Recognition and OCR",
      href: "https://github.com/rahfianugerah/hanacaraka-ajisaka-writings",
      status: "Maintained",
      description:
        "A stacked pretrained models pipeline combining 3 pretraned models (MobileNetV2, EfficientNetB0, ResNet50) with ANN as meta learner improved with Tree-structured Parzen Estimator (TPE) for hyperparameter optimization to enhance handwritten character recognition and OCR accuracy on Javanese Scripts (Aksara Jawa) dataset.",
      technologies: [
        "Python",
        "Pytorch",
        "ResNet50",
        "EfficientNetB0",
        "MobileNetV2",
        "CNN",
        "ANN",
        "TPE",
        "Pretrained Models",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/rahfianugerah/hanacaraka-ajisaka-writings",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/hanacaraka-project.png",
      video: "",
    },
    {
      title: "Hybrid CNN Vision Transformer (ViT) Model for Enhanced Image Classification",
      href: "https://github.com/rahfianugerah/hybrid-cnn-vit",
      status: "Maintained",
      description:
        "A hybrid model combining Convolutional Neural Networks (CNN) and Vision Transformer (ViT) architectures to improve image classification performance by leveraging the strengths of both approaches with embedding patch.",
      technologies: [
        "Python",
        "Pytorch",
        "Vision Transformer (ViT)",
        "CNN",
        "Pretrained Models",
      ],
      links: [
        {
          type: "Original Source",
          href: "https://github.com/clavinorach/hybrid-cnn-vit",
          icon: <Icons.github className="size-3" />,
        },
        {
          type: "Forked Source",
          href: "https://github.com/rahfianugerah/hybrid-cnn-vit",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/hybrid-cnn-vit-project.png",
      video: "",
    },
    {
      title: "Unified ConvNeXt Pipeline for Image Classification, Object Detection, and OCR",
      href: "https://github.com/rahfianugerah/unified-convnext-pipeline",
      status: "Maintained",
      description:
        "A unified pipeline for ConvNeXt models to perform image classification, object detection, and OCR tasks efficiently.",
      technologies: [
        "Python",
        "Pytorch",
        "ConvNeXT",
        "Pretrained Models",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/rahfianugerah/unified-convnext-pipeline",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/unified-convnext-pipeline-project.png",
      video: "",
    },
    {
      title: "The Assistant - Gemma 3: 4B Powered Chatbot Assistant",
      href: "https://github.com/rahfianugerah/the-assistant-gemma3-4b",
      status: "Maintained",
      description:
        "The Assistant is a Gemma 3: 4B Powered chatbot assistant designed to help you explain and generate knowledege faster and more efficiently. Provide the things you and he's ready to help you.",
      technologies: [
        "Next.js",
        "Python",
        "Ollama",
        "gemma3:4b",
        "LLMs",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/rahfianugerah/the-assistant-gemma3-4b",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/the-assistant-project.png",
      video: "",
    },
    {
      title: "Codepilot",
      href: "https://github.com/rahfianugerah/codepilot-qwen2.5-7b-instruct",
      status: "Maintained",
      description:
        "Codepilot is an Qwen 2.5-Coder: 7B Powered coding assistant designed to help developers write code faster and more efficiently. It provides for code generation, fixing code, refactoring and explaining code, making it easier for developers to focus on their work and improve productivity.",
      technologies: [
        "Next.js",
        "Python",
        "FastAPI",
        "Ollama",
        "qwen2.5-coder:7b-instruct-q4_K_M",
        "LLMs",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/rahfianugerah/codepilot-qwen2.5-7b-instruct",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/codepilot-project.png",
      video: "",
    },
    {
      title: "An MLOps Approach for Heart Failure Prediction Using MLP and Bayesian Optimization via Tree-Structured Parzen Estimator (TPE)",
      href: "https://github.com/rahfianugerah/mlops-heart-failure",
      status: "Maintained",
      description:
        "The goal of this MLOps project is to build and deploy a robust heart failure prediction system using machine learning model. The project will use an MLOps lifecycle to automate the training, optimization, and deployment of the model.",
      technologies: [
        "Python",
        "TensorFlow",
        "Keras",
        "Scikit-Learn",
        "Numpy",
        "Pandas",
        "Matplotlib",
        "Seaborn",
        "MLflow",
        "Prometheus",
        "Grafana",
      ],
      links: [
        {
          type: "Source Code",
          href: "https://github.com/rahfianugerah/mlops-heart-failure",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/mlops-heart-failure-project.png",
      video: "",
    },
    {
      title: "Optimizing Stroke Risk Prediction Using Artificial Neural Networks with Feature Selection Based on Binary Particle Swarm Optimization",
      href: "https://github.com/rahfianugerah/research-model",
      status: "Maintained - Research",
      description:
        "This project aims to develop an optimized stroke risk prediction model using Artificial Neural Networks (ANN) combined with feature selection based on Binary Particle Swarm Optimization (BPSO). The goal is to enhance the accuracy and efficiency of stroke risk assessment by identifying the most relevant features and fine-tuning the ANN model.",
      technologies: [
        "Python",
        "TensorFlow",
        "Keras",
        "Scikit-Learn",
        "Numpy",
        "Pandas",
        "Matplotlib",
        "Seaborn",
      ],
      links: [
        {
          type: "Source Code",
          href: "https://github.com/rahfianugerah/research-model",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/research-model-project.png",
      video: "",
    },
    {
      title: "Asah -  Course Submissions, Code Resources, and Docs",
      href: "https://github.com/rahfianugerah/asah-machine-learning",
      status: "Maintained",
      description:
        "Repository showcasing all work from the Asah - Machine Learning, including course submissions, code resources, and documentation.",
      technologies: [
        "Python",
        "TensorFlow",
        "Keras",
        "Scikit-Learn",
        "Numpy",
        "Pandas",
        "Matplotlib",
        "Seaborn",
        "Mlflow",
        "Prometheus",
        "Grafana",
      ],
      links: [
        {
          type: "Source Code",
          href: "https://github.com/rahfianugerah/asah-machine-learning",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/asah-project.png",
      video: "",
    },
    {
      title: "inTrain.ai: Mobile AI-Powered Application for Interview Preparation and Upskilling",
      href: "https://github.com/intrain-ai",
      status: "Maintained",
      description:
        "inTrain.ai is an AI-powered mobile application designed as a comprehensive solution for professional career planning and development. The platform integrates Large Language Model (LLM) technology to provide an AI HR Chatbot (Voice talk AI interview in newer version!), allowing users to engage in interactive mock interview simulations across various difficulty levels and job scenarios to receive real-time feedback and evaluation. Beyond interview practice, inTrain.ai facilitates holistic job preparation through a CV Analyzer for ATS-standard document optimization, personalized Job Roadmaps, and a curated course catalog for upskilling, as well as a Mentorship Matchmaking feature that connects users directly with industry practitioners. (Coming soon and stay tuned as full production grade apps!)",
      technologies: [
        "Kotlin",
        "Python",
        "Flask",
        "GCP",
        "Gemini LLM",
        "Docker",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/intrain-ai",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/intrain-ai-project.png",
      video: "",
    },
    {
      title: "EzTrip: AI-Powered Travel Companion & Automatic Itinerary Planner",
      href: "https://github.com/C242-PS269",
      status: "Maintained",
      description:
        "By leveraging AI-powered recommendation engines, EzTrip offers personalized suggestions based on users' interests and travel goals, streamlining the process of destination discovery, booking, and expense management. With an integrated expense tracker and generated itineraries, users can monitor their travel budgets in real-time, making it easier to plan and control spending throughout their journey. Our team is focused on enhancing Indonesia’s tourism experience by making local insights accessible to global tourists and supporting sustainable tourism growth. This project seeks to solve real challenges in destination planning for foreign travelers by simplifying their access to curated travel information & budgeting.",
      technologies: [
        "Python",
        "Flask",
        "TensorFlow",
        "Kotlin",
        "GCP",
        "Docker",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/C242-PS269",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/eztrip-project.png",
      video: "",
    },
    {
      title: "Bangkit Academy 2024 Batch 2 -  Course Submissions, Code Resources, and Docs",
      href: "https://github.com/rahfianugerah/bangkit-cc-2024-b2",
      status: "Maintained",
      description:
        "Repository showcasing all work from the Bangkit Academy 2024 Batch 2 -  Cloud Computing Cohort, including course submissions, code resources, and documentation.",
      technologies: [
        "Python",
        "TensorFlow",
        "Keras",
        "Scikit-Learn",
        "Numpy",
        "Pandas",
        "Matplotlib",
        "Seaborn",
        "Flask",
        "Google Cloud",
        "HTML",
        "CSS",
        "JavaScript",
        "Docker"
      ],
      links: [
        {
          type: "Source Code",
          href: "https://github.com/rahfianugerah/bangkit-cc-2024-b2",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/bangkit-project.png",
      video: "",
    },
    {
      title: "Dicoding ML Engineer Path - Course Submissions, Code Resources, and Docs",
      href: "https://github.com/rahfianugerah/dicoding-ml-engineer",
      status: "Maintained",
      description:
        "Repository showcasing all work from the Dicoding ML Engineer Path self-learning subscription, including course submissions, code resources, and documentation.",
      technologies: [
        "Python",
        "TensorFlow",
        "Keras",
        "Scikit-Learn",
        "Numpy",
        "Pandas",
        "Matplotlib",
        "Seaborn",
        "TFX",
        "Prometheus",
        "Grafana",
      ],
      links: [
        {
          type: "Source Code",
          href: "https://github.com/rahfianugerah/dicoding-ml-engineer",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/dicoding-project.png",
      video: "",
    },
    {
      title: "dotfiles",
      href: "https://github.com/rahfianugerah/dotfiles",
      status: "Maintained",
      description:
        "Personalized dotfiles repository to streamline and enhance my development environment across multiple systems. It includes configurations for shell, editor, and various tools to ensure a consistent and efficient workflow.",
      technologies: [
        "Arch Linux",
        "WSL2",
        "Zsh",
        "OhMyPosh",
        "Git",
        "Bash",
        "Shell Scripting",
      ],
      links: [
        {
          type: "Source Code",
          href: "https://github.com/rahfianugerah/dotfiles",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/dotfiles.png",
      video: "",
    },
    {
      title: "Commit Wave",
      href: "https://github.com/rahfianugerah/commitwave",
      status: "Maintained",
      description:
        "Automated GitHub Commits Bot: This bot will maintain your github commit history using datetime range and will commit randomly based on your input",
      technologies: [
        "JavaScript",
        "Node.js",
      ],
      links: [
        {
          type: "Source Code",
          href: "https://github.com/rahfianugerah/commitwave",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/commitwave-project.png",
      video: "",
    },
  ],
  hardwork: [
    {
      title: "Best Capstone Project - Asah led by Dicoding in association with Accenture",
      dates: "Jan 2026",
      location: "Jakarta, Indonesia",
      issued: "Asah led by Dicoding in association with Accenture",
      description: "Awarded 'Best Capstone Project' by leading the development of AEGIS, an AI-powered maintenance copilot that leverages machine learning and Agentic AI to predict equipment failures and optimize maintenance schedules, significantly reducing downtime and operational costs for industrial clients.",
      image: "",
      links: [
        {
          title: "Certificate",
          href: "https://drive.google.com/file/d/1fuSxTxlqcnTn9x1gGAkd_G7L10E7lijO/view?usp=sharing",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "HKI (Hak Kekayaan Intelektual) - Patents - inTrain.ai: Mobile AI-Powered Application for Interview Preparation and Upskilling",
      dates: "Jan 2026",
      location: "Jakarta, Indonesia",
      issued: "Direktorat Jenderal Kekayaan Intelektual, Kementerian Hukum dan Hak Asasi Manusia Republik Indonesia",
      description: "inTrain.ai is an AI-powered mobile application designed as a comprehensive solution for professional career planning and development. The platform integrates Large Language Model (LLM) technology to provide an AI HR Chatbot (Voice talk AI interview in newer version!), allowing users to engage in interactive mock interview simulations across various difficulty levels and job scenarios to receive real-time feedback and evaluation. Beyond interview practice, inTrain.ai facilitates holistic job preparation through a CV Analyzer for ATS-standard document optimization, personalized Job Roadmaps, and a curated course catalog for upskilling, as well as a Mentorship Matchmaking feature that connects users directly with industry practitioners. (Coming soon and stay tuned as full production grade apps!)",
      image: "",
      links: [
        {
          title: "Patents",
          href: "https://hakcipta.dgip.go.id/legal/c/YWE1MDFjNzYyY2M5Yjg0NmI3ZDQ3ODUxYzE3MDZkMTk=",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Amartha Hackathon x GDG Jakarta - Finalist",
      dates: "Nov 2025",
      location: "Jakarta, Indonesia",
      issued: "Amartha, Google Developer Group (GDG) Jakarta",
      description: "Recognized as a finalist or Top 15 teams in the Amartha Hackathon x GDG Jakarta for developing an innovative solution that leverages technology to address real-world challenges in the financial sector.",
      image: "",
      links: [
        {
          title: "Certificate (N/A)",
          href: "",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "GEMASTIK XVIII (Pagelaran Mahasiswa Nasional Bidang Teknologi Informasi dan Komunikasi) 2025 Data Mining - Finalist",
      dates: "Oct 2025",
      location: "Jakarta, Indonesia",
      issued: "Direktorat Pembelajaran dan Kemahasiswaan (Dit. Belmawa), Direktorat Jenderal Pendidikan Tinggi (Ditjen Dikti), Kementerian Pendidikan Tinggi, Sains, dan Teknologi (Kemendiktisaintek)",
      description: "Recognized as a national finalist in the Data Mining category for delivering a high-leverage analytical solution that showcased robust modeling strategy, scalable data engineering, and actionable insights.",
      image: "/gemastik18.jpg",
      links: [
        {
          title: "Certificate",
          href: "https://drive.google.com/file/d/1Nb8oXpVJAEW09WGNNZOfhBil-xVrKHEE/view?usp=sharing",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Gold Medalist - National Innovation Exhibition (Pekan Inovasi Nasional) 2025",
      dates: "Jul 2025",
      location: "Jakarta, Indonesia",
      issued: "INNOPA, Mercu Buana University",
      description: "Awarded the Gold Medal at the 2025 National Innovation Exhibition (Pekan Inovasi Nasional) for excellence in product innovation, recognizing outstanding creativity and technical achievement.",
      image: "/pin2025.jpg",
      links: [
        {
          title: "Certificate",
          href: "https://drive.google.com/file/d/13CCi694fva01Y5JTz_8fdwAegFgLJ2KE/view?usp=sharing",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Cloud Computing Distinction Graduate 2024 Batch 2 - Bangkit Academy led by Google, Goto and Traveloka",
      dates: "Jan 2025",
      location: "Jakarta, Indonesia",
      issued: "Bangkit led by Google, Goto, and Traveloka",
      description: "Graduated with Distinction by ranking in the top 10% of participants across every learning-path cohort, demonstrating exceptional academic performance and dedication.",
      image: "/bangkit.jpg",
      links: [
        {
          title: "Certificate",
          href: "https://drive.google.com/file/d/1dFG1HTHIrias6pO1ipwk5j6mUXnBpvcZ/view?usp=sharing",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "4th Place Best Chatbot & Top 10 Finalist - Indonesia Chatbot Championship Challenge (IC3) 2024, Theme: Generative AI",
      dates: "Dec 2024",
      location: "Jakarta, Indonesia",
      issued: "ai4impact, TerraAI, MobileFaculty",
      description: "Successfully achieved 4th place out of 150+ participants in the Indonesian Chatbot Championship Challenge (IC3) 2024, focusing on Generative AI. Developed an innovative chatbot leveraging Smojo.AI and OpenAI API to simplify and enhance coding education. The chatbot empowers users to learn programming effortlessly through interactive and concise guidance, bridging the gap in educational accessibility.",
      image: "/ic32024.png",
      links: [
        {
          title: "Certificate",
          href: "https://drive.google.com/file/d/1oS97X_V6Uplko-88QHaTDK-xgEkGoVJz/view?usp=sharing",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
  ],
  certifications: [
    {
      title: "AWS Certified Cloud Practitioner",
      issued: "Amazon Web Services (AWS)",
      category: ["Cloud Computing"],
      links: [
        {
          title: "Certificate",
          href: "https://www.credly.com/badges/373c0502-683a-4d79-a758-d7e7979c8f3b/public_url",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Alibaba Cloud Certified Big Data Associate",
      issued: "Alibaba Cloud",
      category: ["Cloud Computing", "Big Data"],
      links: [
        {
          title: "Certificate",
          href: "https://drive.google.com/file/d/1quS-1G7Ru8i4eZvQ5rYoA74NI4lQG6se/view?usp=sharing",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
  ],
  learning_certificate: [
    // Dicoding Indonesia Provider
    {
      title: "Membangun Proyek Deep Learning Tingkat Mahir",
      issued: "Dicoding Indonesia",
      category: ["Python", "Deep Learning", "Data Science", "Mathematics", "Statistics", "TensorFlow"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/KEXL2RKY0ZG2",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Matematika untuk Data Science",
      issued: "Dicoding Indonesia",
      category: ["Python", "Machine Learning", "Data Science", "Mathematics", "Statistics"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/98XWO09E9ZM3",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Membangun Sistem Machine Learning",
      issued: "Dicoding Indonesia",
      category: ["Python", "Machine Learning", "MLOps", "Model Deployment", "ML Pipeline", "Grafana", "Prometheus"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/81P2532QNPOY",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Prinsip Pemrograman SOLID",
      issued: "Dicoding Indonesia",
      category: ["Software Engineering", "SOLID Principles"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/N9ZO2DM2RPG5",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Dasar Cloud dan Gen AI di AWS",
      issued: "Dicoding Indonesia",
      category: ["Cloud Computing", "Generative AI"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/RVZKWDRNQZD5",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Penggunaan Generative AI",
      issued: "Dicoding Indonesia",
      category: ["Generative AI"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/2VX3K8YG3XYQ",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "AI Praktis untuk Produktivitas",
      issued: "Dicoding Indonesia",
      category: ["Artificial Intelligence", "Productivity"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/53XEDVJ8VPRN",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Memulai Pemrograman Dengan C",
      issued: "Dicoding Indonesia",
      category: ["C Programming"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/RVZKWYL3MZD5",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Back-End Pemula dengan JavaScript",
      issued: "Dicoding Indonesia",
      category: ["Back-End Development", "JavaScript"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/98XWEG5NLXM3",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Penerapan Machine Learning dengan Google Cloud",
      issued: "Dicoding Indonesia",
      category: ["Machine Learning", "Cloud Computing"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/N9ZOYN8J8PG5",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Menjadi Google Cloud Engineer",
      issued: "Dicoding Indonesia",
      category: ["Cloud Computing", "Google Cloud"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/L4PQ51RDOZO1",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Membuat Aplikasi Back-End untuk Pemula dengan Google Cloud",
      issued: "Dicoding Indonesia",
      category: ["Back-End Development", "Cloud Computing"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/L4PQ5484VZO1",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Dasar Pemrograman JavaScript",
      issued: "Dicoding Indonesia",
      category: ["JavaScript", "Programming Fundamentals"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/KEXL154JMXG2",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Dasar AI",
      issued: "Dicoding Indonesia",
      category: ["Artificial Intelligence"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/KEXL23W50ZG2",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Dasar Pemrograman Web",
      issued: "Dicoding Indonesia",
      category: ["Web Development"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/KEXL1KQO0XG2",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Memulai Dasar Pemrograman untuk Menjadi Pengembang Software",
      issued: "Dicoding Indonesia",
      category: ["Programming Fundamentals", "Software Engineering"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/GRX5JKYNYX0M",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Dasar Git dengan GitHub",
      issued: "Dicoding Indonesia",
      category: ["Version Control", "Git", "GitHub"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/2VX352LJ3PYQ",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Pengenalan ke Logika Pemrograman (Programming Logic 101)",
      issued: "Dicoding Indonesia",
      category: ["Programming Logic", "Problem Solving"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/GRX5JKYGYX0M",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Machine Learning Operations (MLOps)",
      issued: "Dicoding Indonesia",
      category: ["Machine Learning", "MLOps"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/KEXL1J89MXG2",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Architecting on AWS (Membangun Arsitektur Cloud di AWS)",
      issued: "Dicoding Indonesia",
      category: ["Cloud Computing", "AWS"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/98XWLYWN4ZM3",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Machine Learning Terapan",
      issued: "Dicoding Indonesia",
      category: ["Machine Learning"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/QLZ97OR7EP5D",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Dasar Manajemen Proyek",
      issued: "Dicoding Indonesia",
      category: ["Project Management"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/MRZMERK50PYQ",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Analisis Data dengan Python",
      issued: "Dicoding Indonesia",
      category: ["Data Analysis", "Python"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/MEPJNN96JX3V",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Fundamental Deep Learning",
      issued: "Dicoding Indonesia",
      category: ["Deep Learning", "Artificial Intelligence"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/JLX15LK65Z72",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Machine Learning untuk Pemula",
      issued: "Dicoding Indonesia",
      category: ["Machine Learning"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/NVP7J1MRVXR0",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Dasar Google Cloud",
      issued: "Dicoding Indonesia",
      category: ["Cloud Computing", "Google Cloud"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/QLZ97DM27P5D",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Dasar Structured Query Language (SQL)",
      issued: "Dicoding Indonesia",
      category: ["SQL", "Databases"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/98XWLW9G4ZM3",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Dasar Data Science",
      issued: "Dicoding Indonesia",
      category: ["Data Science"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/2VX3O8DVQZYQ",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Memulai Pemrograman dengan Python",
      issued: "Dicoding Indonesia",
      category: ["Python", "Programming Fundamentals"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/1OP8JL39LPQK",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Dasar Visualisasi Data",
      issued: "Dicoding Indonesia",
      category: ["Data Visualization"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/53XEOL8NRZRN",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Belajar Dasar-Dasar DevOps",
      issued: "Dicoding Indonesia",
      category: ["DevOps"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/L4PQ8G5GOZO1",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },

    // Coursera Provider
    {
      title: "Google Cybersecurity Specialization",
      issued: "Coursera",
      category: [
        "Network Security",
        "Python Programming",
        "Linux",
        "Cloud Computing",
        "Computer Programming",
        "Audit",
        "Risk Management",
        "Cryptography",
        "Leadership and Management",
        "Network Architecture",
      ],
      links: [
        {
          title: "Certificate",
          href: "https://coursera.org/share/47330bd478ce3b2a217bb808007c944e",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Put It to Work: Prepare for Cybersecurity Jobs",
      issued: "Coursera",
      category: [
        "Storytelling",
        "Computer Programming",
        "SQL",
        "Leadership and Management",
        "Python Programming",
      ],
      links: [
        {
          title: "Certificate",
          href: "https://coursera.org/share/cf88f231c21172e2fb1a33090d1c0565",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Automate Cybersecurity Tasks with Python",
      issued: "Coursera",
      category: ["Python Programming"],
      links: [
        {
          title: "Certificate",
          href: "https://coursera.org/share/a00dcfd5292ba0ab7f4dafacd4c3ea77",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Sound the Alarm: Detection and Response",
      issued: "Coursera",
      category: ["Network Security", "Linux", "Cryptography"],
      links: [
        {
          title: "Certificate",
          href: "https://coursera.org/share/a0896c869045af167e288243c652039d",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Assets, Threats, and Vulnerabilities",
      issued: "Coursera",
      category: ["Cryptography", "Linux", "Network Security"],
      links: [
        {
          title: "Certificate",
          href: "https://coursera.org/share/4d23bb51355118aaefda0b6b6a7623fa",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Tools of the Trade: Linux and SQL",
      issued: "Coursera",
      category: ["Linux", "SQL"],
      links: [
        {
          title: "Certificate",
          href: "https://coursera.org/share/861e1fd25f42d962bea5e63aa8dde725",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Connect and Protect: Networks and Network Security",
      issued: "Coursera",
      category: ["Network Security", "Cloud Computing", "Networking Hardware"],
      links: [
        {
          title: "Certificate",
          href: "https://coursera.org/share/83e3ecb2b75e3d15ac5102619172f21c",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Foundations of Cybersecurity",
      issued: "Coursera",
      category: ["Network Security", "Python Programming", "Linux"],
      links: [
        {
          title: "Certificate",
          href: "https://coursera.org/share/a4d6df8db694a9f2f312ad2155e69a73",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Play It Safe: Manage Security Risks",
      issued: "Coursera",
      category: [
        "Leadership and Management",
        "Audit",
        "Computer Security Incident Management",
        "Risk Management",
      ],
      links: [
        {
          title: "Certificate",
          href: "https://coursera.org/share/f0cdd2f3964822ffb860db4213c7eddf",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
  ]
} as const;