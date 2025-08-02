import { Icons } from "@/components/icons";
import { TbCertificate } from "react-icons/tb";
import { HomeIcon, NotebookIcon, TerminalIcon } from "lucide-react";

export const DATA = {
  name: "Rahfi",
  initials: "R",
  url: "https://rahfi.pro",
  location: "Jakarta, Indonesia",
  locationLink: "https://www.google.com/maps/place/jakarta",
  description:
    "A versatile and highly adaptable #Software/AI Engineer with a rapid learning curve, specializing in AI, Machine Learning, Cloud Computing, and Website Development.",
  summary:
    "I'm a versatile and highly adaptable #Software/AI Engineer with a rapid learning curve, specializing in AI, Machine Learning, Cloud Computing, and Website Development. With a strong foundation in cutting-edge technologies, I am passionate about leveraging my expertise to design and implement innovative, scalable solutions.",
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
    "Keras",
    "PyTorch",
    "Pandas",
    "NumPy",
    "Seaborn",
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
    { href: "/project", icon: TerminalIcon, label: "Project" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "hello@example.com",
    tel: "+123456789",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/rahfianugerah",
        icon: Icons.github,

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
      company: "Dicoding Indonesia",
      href: "#",
      badges: ["Remote", "Freelance", "Code Review", "Mentor", "Machine Learning", "Google Cloud"],
      location: "Jakarta, Indonesia",
      title: "External Academy Code Reviewer",
      logoUrl: "/dicoding.jpeg",
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
      logoUrl: "/dicoding.jpeg",
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
      logoUrl: "/sic.jpg",
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
      badges: ["Remote", "Full-Time", "Cloud Computing", "Cohort", "Project Lead", "Back-End Engineering", "Cloud Engineering"],
      location: "Jakarta, Indonesia",
      title: "Capstone Project Lead - Cloud Computing Cohort",
      logoUrl: "/bangkit.jpg",
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
    {
      company: "Bangkit Academy 2024 Batch 2 - Bangkit led by Google, Goto and Traveloka",
      href: "#",
      badges: ["Remote", "Full-Time", "Cloud Computing", "Cohort"],
      location: "Jakarta, Indonesia",
      title: "Cloud Computing Cohort",
      logoUrl: "/bangkit.jpg",
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
      logoUrl: "/aslab.jpg",
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
      title: "GDSC Member",
      logoUrl: "/gdsc.jpg",
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
      title: "AWS Engineer Trainee",
      logoUrl: "/dts.jpg",
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
      logoUrl: "/umb.jpg",
      start: "2022",
      end: "2026 (Expected)",
      description: [
        "GPA: 3.87/4",
        "Pursuing a Bachelor's degree in Computer Science majoring in Information Systems, with a strong focus on the intersection of technology, data, and business processes. The program emphasizes system analysis and design, database management, enterprise systems, and IT project management — equipping me with both technical and managerial competencies to build, manage, and optimize digital solutions in modern organizations.",
        "Relevant Course Work: Mathematics, Linear Algebra, Statistics and Probability, Advanced Statistic, Algorithm and Programming, Algorithm and Data Structure, Database Systems, Database Implementation, Object Oriented Analysis, Advanced Programming, Software Engineering, Data Warehouse & Big Data, PL/SQL Programming, Data Visualization, Process Mining, Data Simulation, Data Analytic I, Data Analytic II, Web Programming, Web Enterprise Programming, Project Management Information System, Information System Development Project"
      ],
    },
    {
      school: "Bangkit Academy 2024 Batch 2 - Bangkit led by Google, Goto and Traveloka",
      href: "https://grow.google/intl/id_id/bangkit/?tab=cloud-computing",
      degree: "Non-Degree Program in Cloud Computing",
      logoUrl: "/bangkit.jpg",
      start: "Aug 2024",
      end: "Jan 2025",
      description: [
        "Selected among 4,636 candidates out of 45,841 applicants for the Google GoTo & Traveloka–led program, where I deepened my technical expertise through hands‑on workshops in cloud platforms, software engineering best practices, and emerging technologies.",
        "Achieved Distinction Graduate status, recognized within the top 10% of each learning path cohort."
      ],
    },
    {
      school: "Dicoding Indonesia",
      href: "https://www.dicoding.com",
      degree: "Non-Degree Program in Machine Learning",
      logoUrl: "/dicoding.jpeg",
      start: "Mar 2024",
      end: "Aug 2024",
      description: [
        "Dedicated six‑month self‑directed learning journey focused on the Machine Learning Engineer career path, mastering core concepts of machine learning and hands‑on implementation of the models.",
        "Studied and implemented key machine learning fundamentals, including supervised and unsupervised learning.",
        "Developed deep learning expertise."
      ],
    },
  ],
  projects: [
    {
      title: "rahfi.pro",
      href: "https://rahfi.pro",
      status: "In Progress",
      description:
        "A personal portfolio website showcasing my skills, projects, and achievements. Built with Next.js and Tailwind CSS.",
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
      title: "Commit Wave",
      href: "",
      status: "Archived",
      description:
        "Commit Wave is an automation tool designed to help developers keep their GitHub contribution history consistently active and engaging. By utilizing GitHub Actions or JavaScript based, this bot automates the process of generating and pushing commits at random intervals (GitHub Action & JavaScript) within a user-defined date range (JavaScript).",
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
      image: "/commitwave.png",
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
      image: "",
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
      image: "",
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
      description: "Successfully achieve 4th place out of 150+ participants in the Indonesian Chatbot Championship Challenge (IC3) 2024, focusing on Generative AI.I developed an innovative chatbot leveraging Smojo.AI and OpenAI API to simplify and enhance coding education.The chatbot empowers users to learn programming effortlessly through interactive and concise guidance, bridging the gap in educational accessibility.",
      image: "",
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
    {
      title: "MLOps (Machine Learning Operations)",
      issued: "Dicoding Indonesia",
      category: ["Machine Learning"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/KEXL1J89MXG2",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: " Applied Machine Learning (Machine Learning Terapan)",
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
      title: "Learn Applied Machine Learning with Google Cloud (Belajar Penerapan Machine Learning dengan Google Cloud)",
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
      title: "Architecting on AWS (Membangun Arsitektur Cloud di AWS)",
      issued: "Dicoding Indonesia",
      category: ["Cloud Computing"],
      links: [
        {
          title: "Certificate",
          href: "https://www.dicoding.com/certificates/98XWLYWN4ZM3",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
    {
      title: "Google Cybersecurity Specialization",
      issued: "Coursera",
      category: ["Cybersecurity"],
      links: [
        {
          title: "Certificate",
          href: "https://coursera.org/share/47330bd478ce3b2a217bb808007c944e",
          icon: <TbCertificate className="size-3" />,
        },
      ],
    },
  ],
} as const;
