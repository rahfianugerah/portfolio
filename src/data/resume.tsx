import { Icons } from "@/components/icons";
import { FaBusinessTime } from "react-icons/fa";
import { TbCertificate } from "react-icons/tb";
import { HomeIcon, NotebookIcon, TerminalIcon } from "lucide-react";

export const DATA = {
  name: "Naufal Rahfi Anugerah",
  initials: "R",
  url: "https://rahfi.pro",
  location: "Jakarta, Indonesia",
  locationLink: "https://www.google.com/maps/place/jakarta",
  description: "Software Engineer",
  summary: "Final-year Computer Science student at Mercu Buana University, specializing in Information Systems and back-end–focused Software/AI Engineering. Experienced in building robust APIs with Flask and FastAPI, deploying containerized and serverless solutions on Google Cloud, AWS, and Azure, and developing predictive models using TensorFlow and Scikit-learn. Skilled in delivering scalable, high-impact machine learning and backend systems, with additional capability in lightweight frontend development using Next.js.",
  avatarUrl: "",
  programmingLanguages: [
    "Python",
    "JavaScript",
    "TypeScript",
    "C++",
    "C"
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
      title: "Software Engineer",
      logoUrl: "/amn-exp.png",
      start: "Sep 2025",
      end: "Present",
      description: [],
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
      description: [],
    },
    {
      company: "Asah led by Dicoding in association with Accenture",
      href: "#",
      badges: ["Remote", "Full-Time", "Machine Learning", "Cohort"],
      location: "Jakarta, Indonesia",
      title: "Machine Learning Cohort",
      logoUrl: "/asah-exp.png",
      start: "Aug 2025",
      end: "Present",
      description: [
        "Gained a solid foundation in core machine learning principles, covering both supervised and unsupervised learning techniques.",
        "Applied deep learning methods in practice, developing expertise with neural networks.",
        "Enhanced coding practices and optimized model performance through continuous experimentation and iterative improvement.",
        "Built and automated machine learning systems and pipelines for efficient workflows.",
        "Acquired hands-on experience in model deployment, monitoring, and ML pipeline automation to ensure scalability and reliability."
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
        "Reviewing student-led projects, assessing implementation quality, adherence to best practices, and providing detailed feedback to enhance their practical skills.",
        "Reviewing student submissions across Machine Learning learning path & Google Cloud Professional learning path, providing constructive feedback to enhance learners’ understanding.",
        "Supporting learners' skill development in leveraging Machine Learning models and Google Cloud platform."
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
        "Committed to self-learning and skill development in machine learning for 6 consecutive months.",
        "Studied and implemented key machine learning fundamentals, including supervised and unsupervised learning.",
        "Developed deep learning expertise through practical application of neural networks, CNN, RNN, and LSTM.",
        "Built and deployed multiple end-to-end projects in domains such as Time series forecasting, Image classification, Text classification and Natural Language Processing (NLP), Regression analysis, Clustering and pattern recognition, Predictive modeling and business intelligence.",
        "Continuously improved coding practices and model performance through experimentation and iteration.",
        "Completed the Expert MLOps class and successfully passed the final evaluation.",
        "Gained hands-on experience with model deployment, monitoring, and ML pipeline automation."
      ],
    },
    {
      company: "Samsung Innovation Campus Batch 6",
      badges: ["Remote", "Trainee", "Artificial Intelligence", "IoT"],
      href: "#",
      location: "Jakarta, Indonesia",
      title: "Artificial Intelligence & IoT Development Trainee",
      logoUrl: "/sic-exp.jpg",
      start: "Jan 2025",
      end: "Feb 2025",
      description: [
        "Gaining hands-on experience in AI and IoT development by working on real-world projects.",
        "Exploring various microcontrollers, including ESP32, to understand their capabilities and applications.",
        "Designing and building IoT kit devices to develop practical and innovative solutions.",
        "Applying design thinking principles to create user-centric IoT solutions that address real-world challenges."
      ],
    },
    {
      company: "Bangkit Academy 2024 Batch 2 - Bangkit led by Google, Goto and Traveloka",
      href: "#",
      badges: ["Remote", "Full-Time", "Cloud Computing", "Cohort"],
      location: "Jakarta, Indonesia",
      title: "Cloud Computing Cohort",
      logoUrl: "/bangkit-exp.jpg",
      start: "Aug 2024",
      end: "Jan 2025",
      description: [
        "Gaining hands-on experience in creating fully functional websites, focusing on both front-end and back-end technologies.",
        "Learning how to design and plan scalable cloud infrastructures for application development, ensuring high availability and security.",
        "Mastering the process of deploying ML models to the cloud for integration into applications, enhancing performance and reliability.",
        "Building web servers to handle REST API requests and efficiently host machine learning models.",
        "Developing expertise in utilizing GCP tools for cloud deployments, security, and model hosting, while applying best practices in real-world scenarios.",
        "Successfully led a team to complete application projects on schedule.",
        "Achieved Distinction Graduate status, recognized within the top 10% of each learning path cohort."
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
        "Provide guidance and support to members of the Back-End learning path, ensuring they understand core concepts and good practices.",
        "Conduct regular one-on-one and group mentoring sessions to address specific challenges and foster a collaborative learning environment.",
        "Create and manage a structured curriculum to facilitate progressive learning and skill acquisition.",
        "Coordinate activities and projects among members to promote teamwork and practical application of back-end development skills."
      ],
    },
    {
      company: "Computer Laboratory Assistant Faculty of Computer Science, Mercu Buana University",
      href: "#",
      badges: ["Part-Time", "On-Site"],
      location: "Jakarta, Indonesia",
      title: "Senior Computer Laboratory Assistant",
      logoUrl: "",
      start: "Jan 2024",
      end: "Feb 2025",
      description: [
        "Provided on-the-spot technical support to students and faculty for any computer-related issues during class time.",
        "Assisted in troubleshooting software and hardware problems, ensuring smooth operation of classes.",
        "Supported lecturers during lab sessions by preparing necessary equipment, setting up software, and providing technical assistance.",
        "Trained and mentored new laboratory assistants, guiding them through their roles and responsibilities to ensure high performance.",
        "Helped new laboratory assistants to understand technical procedures, lab protocols, and best practices, fostering a collaborative and efficient lab environment."
      ],
    },
    {
      company: "Computer Laboratory Assistant Faculty of Computer Science, Mercu Buana University",
      href: "#",
      badges: ["Part-Time", "On-Site"],
      location: "Jakarta, Indonesia",
      title: "Junior Computer Laboratory Assistant",
      logoUrl: "",
      start: "Apr 2023",
      end: "Jan 2024",
      description: [
        "Ensured the proper functioning and upkeep of all computer hardware and peripherals within the laboratory.",
        "Performed regular maintenance tasks, including software updates, system backups, and hardware troubleshooting.",
        "Provided on-the-spot technical support to students and faculty for any computer-related issues during class time.",
        "Diagnosed and resolved network issues promptly to minimize downtime and disruption.",
        "Assisted in troubleshooting software and hardware problems, ensuring smooth operation of classes.",
        "Supported lecturers during lab sessions by preparing necessary equipment, setting up software, and providing technical assistance.",
        "Facilitated the teaching process by addressing any technical challenges that occurred during lectures."
      ],
    },
    {
      company: "Google Developer Student Club, Mercu Buana University",
      href: "#",
      badges: ["Hybrid", "Community"],
      location: "Jakarta, Indonesia",
      title: "Google Developer Student Club Member",
      logoUrl: "/gdsc-exp.jpg",
      start: "Dec 2023",
      end: "Oct 2024",
      description: [
        "Participated in a community of student developers focused on learning and promoting technology, particularly Google Developer technologies.",
        "Bridged the gap between practical and theoretical knowledge through various hands-on activities.",
        "Creating networking opportunities with other members to foster collaboration and knowledge sharing.",
        "Following workshops to continuously develop and update new tech skills."
      ],
    },
    {
      company: "Digital Talent Scholarship",
      href: "#",
      badges: ["Remote", "AWS", "Trainee"],
      location: "Jakarta, Indonesia",
      title: "DTS AWS Engineer Trainee",
      logoUrl: "/dts-exp.jpg",
      start: "Feb 2024",
      end: "Mar 2024",
      description: [
        "Mastering the effective use of AWS services for various needs.",
        "Creating and designing cloud architecture on the AWS platform according to best practices.",
        "Understanding the basics of AWS clearly and deeply.",
        "Successfully achieving the international AWS Certified Cloud Practitioner certification.",
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
      end: "2026 (Expected)",
      description: [
        "GPA: 3.87/4",
        "Pursuing a Bachelor's degree in Computer Science majoring in Information Systems, with a strong focus on the intersection of technology, data, and business processes. The program emphasizes system analysis and design, database management, enterprise systems, and IT project management — equipping me with both technical and managerial competencies to build, manage, and optimize digital solutions in modern organizations.",
        "Relevant Course Work: Mathematics, Linear Algebra, Statistics and Probability, Advanced Statistic, Algorithm and Programming, Algorithm and Data Structure, Database Systems, Database Implementation, Object Oriented Analysis, Advanced Programming, Software Engineering, Data Warehouse & Big Data, PL/SQL Programming, Data Visualization, Process Mining, Data Simulation, Data Analytic I, Data Analytic II, Web Programming, Web Enterprise Programming, Project Management Information System, Information System Development Project"
      ],
    },
    {
      school: "Asah led by Dicoding in association with Accenture",
      href: "https://www.dicoding.com",
      degree: "Non-Degree Program in Machine Learning - Machine Learning Cohort",
      logoUrl: "/asah-exp.png",
      start: "Aug 2025",
      end: "Present",
      description: [
        "Gained a strong foundation in supervised and unsupervised machine learning, with practical expertise in deep learning and neural networks. Improved coding practices and model performance through iterative experimentation, while building and automating ML systems, pipelines, and deployment workflows with monitoring and scalability in mind. Acquired through a highly selective scholarship program awarded to only 2,000 candidates worldwide following a rigorous testing process."
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
        "Selected among 4,636 candidates out of 45,841 applicants for the Google GoTo & Traveloka–led program, where I deepened my technical expertise through hands‑on workshops in cloud platforms, software engineering best practices, and emerging technologies.",
        "Achieved Distinction Graduate status, recognized within the top 10% of each learning path cohort."
      ],
    },
  ],
  leadership: [
    {
      company: "Asah led by Dicoding in association with Accenture",
      href: "#",
      badges: ["Remote", "Full-Time", "Machine Learning", "Cohort", "Project Lead", "Modeling", "AI Engineering"],
      location: "Jakarta, Indonesia",
      title: "Capstone Project Lead - Project Manager - Team Lead",
      logoUrl: "/asah-exp.png",
      start: "Oct 2025",
      end: "Present",
      description: [],
    },
    {
      company: "Mercu Buana University",
      href: "#",
      badges: ["Full-Time", "Project Lead", "Back-End Engineering", "Cloud Engineering", "AI Engineering"],
      location: "Jakarta, Indonesia",
      title: "Project Manager - Team Lead - Information Systems Development Project",
      logoUrl: "/umb-edu.jpg",
      start: "Mar 2025",
      end: "Jul 2025",
      description: [
        "Successfully created an AI-powered HR interview mobile application integrating both voice and chat features to enhance candidate evaluation.",
        "Designed and implemented interactive modules to simulate real interview scenarios with AI-driven responses.",
        "Collaborated with team members to ensure smooth functionality, user-friendly design, and reliable system performance.",
        "Applied strong leadership and technical expertise in managing development phases and overcoming project challenges.",
        "Successfully won the National Innovation Exhibition Gold Medal, showcasing innovation and practical impact of the solution."
      ],
    },
    {
      company: "Samsung Innovation Campus Batch 6",
      href: "#",
      badges: ["Project Lead"],
      location: "Jakarta, Indonesia",
      title: "Project Lead - Team Lead",
      logoUrl: "/sic-exp.jpg",
      start: "Jan 2025",
      end: "Feb 2025",
      description: [
        "Led a team in the Samsung Innovation Campus program to develop an IoT-based application project using Ubidots and Flask.",
        "Guided team members in aligning tasks with project goals and timelines, ensuring collaborative progress.",
        "Provided technical and organizational support to maintain smooth project execution and integration of IoT devices.",
        "Managed and directed overall project development, fostering teamwork and effective problem-solving.",
        "Achieved Stage 2 out of 4 in the program, demonstrating strong leadership and practical application of IoT solutions despite challenges."
      ],
    },
    {
      company: "Bangkit Academy 2024 Batch 2 - Bangkit led by Google, Goto and Traveloka",
      href: "#",
      badges: ["Remote", "Full-Time", "Cloud Computing", "Cohort", "Project Lead", "Back-End Engineering", "Cloud Engineering"],
      location: "Jakarta, Indonesia",
      title: "Capstone Project Lead - Project Manager - Team Lead",
      logoUrl: "/bangkit-exp.jpg",
      start: "Nov 2024",
      end: "Dec 2024",
      description: [
        "Successfully led a team to complete application projects on schedule.",
        "Efficiently guided team members to align with project timelines and deliverables.",
        "Provided continuous support to team members to ensure smooth project execution.",
        "Effectively managed and directed the overall progress of projects.",
        "Demonstrated strong leadership in driving project success and fostering team collaboration."
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
      title: "Codepilot",
      href: "https://github.com/codepilot",
      status: "Maintained",
      description:
        "Codepilot is an Qwen 2.5-Coder:7B Powered coding assistant designed to help developers write code faster and more efficiently. It provides for code generation, fixing code, refactoring and explaining code, making it easier for developers to focus on their work and improve productivity.",
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
      href: "https://github.com/rahfianugerah/codepilot",
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
      href: "https://rahfi.pro",
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
          href: "https://github.com/rahfianugerah/portfolio",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/asah-project.png",
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
      title: "Gold Medalist - National Innovation Exhibition (Pekan Inovasi Nasional) 2025",
      dates: "July 2025",
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
      dates: "December 2024",
      location: "Jakarta, Indonesia",
      issued: "ai4impact, TerraAI, MobileFaculty",
      description: "Successfully achieve 4th place out of 150+ participants in the Indonesian Chatbot Championship Challenge (IC3) 2024, focusing on Generative AI. Developed an innovative chatbot leveraging Smojo.AI and OpenAI API to simplify and enhance coding education. The chatbot empowers users to learn programming effortlessly through interactive and concise guidance, bridging the gap in educational accessibility.",
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