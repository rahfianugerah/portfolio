import { Icons } from "@/components/icons";
import { TbCertificate } from "react-icons/tb";
import { HomeIcon, NotebookIcon, TerminalIcon } from "lucide-react";
import fs from 'fs';
import path from 'path';
import { title } from "process";

function readTxtAsList(filename: string): string[] {
  const filePath = path.join(process.cwd(), 'src', 'data', 'desc', filename);
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  return content.split('\n').map(line => line.trim()).filter(Boolean);
}

export const DATA = {
  name: "Rahfi",
  initials: "R",
  url: "https://rahfi.space",
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
      description: readTxtAsList('dicoding-external-academy-code-reviewer.txt'),
    },
    {
      company: "Dicoding Indonesia",
      href: "#",
      badges: ["Student", "Machine Learning"],
      location: "Jakarta, Indonesia",
      title: "Machine Learning Student",
      logoUrl: "/dicoding.jpeg",
      start: "Mar 2025",
      end: "Present",
      description: readTxtAsList('dicoding-ml-student.txt'),
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
      description: readTxtAsList('sic6-trainee.txt'),
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
      description: readTxtAsList('cc-bangkit-cpl.txt'),
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
      description: readTxtAsList('cc-bangkit.txt'),
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
      description: readTxtAsList('clab-be-rnd.txt'),
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
      description: readTxtAsList('clab-senior.txt'),
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
      description: readTxtAsList('clab-junior.txt'),
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
      description: readTxtAsList('gdsc-member.txt'),
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
      description: readTxtAsList('dts-aws.txt'),
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
      description: readTxtAsList('umb.txt'),
    },
    {
      school: "Bangkit Academy 2024 Batch 2 - Bangkit led by Google, Goto and Traveloka",
      href: "https://grow.google/intl/id_id/bangkit/?tab=cloud-computing",
      degree: "Non-Degree Program in Cloud Computing",
      logoUrl: "/bangkit.jpg",
      start: "Aug 2024",
      end: "Jan 2025",
      description: readTxtAsList('bangkit-cc-edu.txt'),
    },
    {
      school: "Dicoding Indonesia",
      href: "https://www.dicoding.com",
      degree: "Non-Degree Program in Machine Learning",
      logoUrl: "/dicoding.jpeg",
      start: "Mar 2024",
      end: "Aug 2024",
      description: readTxtAsList('dicoding-edu.txt'),
    },
  ],
  projects: [
    {
      title: "rahfi.pro",
      href: "https://rahfi.pro",
      dates: "July 2025 - Present",
      active: true,
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
      dates: "Archived",
      active: false,
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
      description: readTxtAsList('achievements-pin2025.txt'),
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
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, fugiat inventore minus quam ad accusantium corrupti impedit at voluptates molestiae. Dolorum quae voluptates nisi voluptatibus harum recusandae quasi deleniti vitae?",
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
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, fugiat inventore minus quam ad accusantium corrupti impedit at voluptates molestiae. Dolorum quae voluptates nisi voluptatibus harum recusandae quasi deleniti vitae?",
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
