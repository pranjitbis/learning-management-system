// courses.js
import androidDevelopment from "../../public/course/Android-PNG-Pic.png";
import appliedPsychology from "../../public/course/Applied-Psychology.jpg";
import artificialIntelligence from "../../public/course/artificialintelligence.jpg";
import arVrDevelopment from "../../public/course/ARVR.avif";
import careerProgression from "../../public/course/career-progression.jpg";
import cloudComputing from "../../public/course/cloudcomputing.webp";
import architecturalDesign from "../../public/course/construction-plans-architectural-project_1232-2918.avif";
import corporateLaw from "../../public/course/corporate-law.webp";
import cybersecurity from "../../public/course/cybersecurity-shield-with-lock-data-protection-privacy-concept.jpg";
import digitalMarketing from "../../public/course/Digital-Marketing.jpg";
import droneTechnology from "../../public/course/drone-takeoff-quadcopter-lamp-propellers-600nw-2552216067.webp";
import fashionDesigning from "../../public/course/FashionDesigning.jpg";
import finance from "../../public/course/Finance.jpg";
import futuristicTech from "../../public/course/futuristic-technology-hologram.jpg";
import geneticsEngineering from "../../public/course/GeneticsEngineering.jpg";
import graphicDesign from "../../public/course/GraphicDesign.jpeg";
import hybridVehicles from "../../public/course/hev_hybrid-electric-vehicle.jpg";
import humanResource from "../../public/course/HumanResource.jpg";
import iotRobotics from "../../public/course/IoT&Robotics.jpg";
import machineLearning from "../../public/course/Machine-Learning.jpg";
import medicalCoding from "../../public/course/MedicalCoding.jpg";
import msEerasProgram from "../../public/course/mseerasprogramcover.jpg";
import webDevelopment from "../../public/course/person-front-computer-working-html.jpg";
import stockMarket from "../../public/course/StockMarket.jpg";
import uiUxDesign from "../../public/course/UI_UXDesign.avif";
import embeddedSystems from "../../public/course/what-are-embedded-systems.png";

const courses = [
  {
    id: 1,
    title: "Android App Development",
    description: "Build modern Android applications with Kotlin and Jetpack",
    image: androidDevelopment,
    category: "Mobile Development",
    duration: "8 weeks",
    level: "Intermediate"
  },
  {
    id: 2,
    title: "Applied Psychology",
    description: "Understand human behavior in professional settings",
    image: appliedPsychology,
    category: "Social Sciences",
    duration: "12 weeks",
    level: "Beginner"
  },
  {
    id: 3,
    title: "AI Fundamentals",
    description: "Introduction to artificial intelligence and machine learning",
    image: artificialIntelligence,
    category: "Computer Science",
    duration: "10 weeks",
    level: "Advanced"
  },
  {
    id: 4,
    title: "AR/VR Development",
    description: "Create immersive augmented and virtual reality experiences",
    image: arVrDevelopment,
    category: "Emerging Tech",
    duration: "6 weeks",
    level: "Intermediate"
  },
  {
    id: 5,
    title: "Career Growth Strategies",
    description: "Accelerate your professional development and advancement",
    image: careerProgression,
    category: "Professional Skills",
    duration: "4 weeks",
    level: "All Levels"
  },
  {
    id: 6,
    title: "Cloud Computing",
    description: "Master AWS, Azure and Google Cloud platforms",
    image: cloudComputing,
    category: "IT & Infrastructure",
    duration: "8 weeks",
    level: "Intermediate"
  },
  {
    id: 7,
    title: "Architectural Design",
    description: "Learn modern architectural principles and CAD tools",
    image: architecturalDesign,
    category: "Design",
    duration: "12 weeks",
    level: "Beginner"
  },
  {
    id: 8,
    title: "Corporate Law Essentials",
    description: "Key legal concepts for business professionals",
    image: corporateLaw,
    category: "Law",
    duration: "5 weeks",
    level: "Beginner"
  },
  {
    id: 9,
    title: "Cybersecurity Fundamentals",
    description: "Protect systems from digital attacks and threats",
    image: cybersecurity,
    category: "Information Security",
    duration: "10 weeks",
    level: "Intermediate"
  },
  {
    id: 10,
    title: "Digital Marketing Mastery",
    description: "SEO, social media, and content marketing strategies",
    image: digitalMarketing,
    category: "Marketing",
    duration: "6 weeks",
    level: "Beginner"
  },
  {
    id: 11,
    title: "Drone Technology",
    description: "Design, build and program autonomous drones",
    image: droneTechnology,
    category: "Emerging Tech",
    duration: "7 weeks",
    level: "Intermediate"
  },
  {
    id: 12,
    title: "Fashion Design",
    description: "From sketching to runway - complete fashion course",
    image: fashionDesigning,
    category: "Creative Arts",
    duration: "14 weeks",
    level: "Beginner"
  },
  {
    id: 13,
    title: "Financial Management",
    description: "Personal and corporate finance fundamentals",
    image: finance,
    category: "Business",
    duration: "8 weeks",
    level: "Beginner"
  },
  {
    id: 14,
    title: "Future Technologies",
    description: "Explore cutting-edge innovations shaping tomorrow",
    image: futuristicTech,
    category: "Emerging Tech",
    duration: "5 weeks",
    level: "All Levels"
  },
  {
    id: 15,
    title: "Genetic Engineering",
    description: "Introduction to biotechnology and gene editing",
    image: geneticsEngineering,
    category: "Biological Sciences",
    duration: "12 weeks",
    level: "Advanced"
  },
  {
    id: 16,
    title: "Graphic Design",
    description: "Master Photoshop, Illustrator and design principles",
    image: graphicDesign,
    category: "Creative Arts",
    duration: "8 weeks",
    level: "Beginner"
  },
  {
    id: 17,
    title: "Electric Vehicle Technology",
    description: "Engineering behind hybrid and electric vehicles",
    image: hybridVehicles,
    category: "Engineering",
    duration: "10 weeks",
    level: "Intermediate"
  },
  {
    id: 18,
    title: "Human Resources Management",
    description: "Modern HR practices and talent development",
    image: humanResource,
    category: "Business",
    duration: "6 weeks",
    level: "Beginner"
  },
  {
    id: 19,
    title: "IoT & Robotics",
    description: "Build smart connected devices and robotic systems",
    image: iotRobotics,
    category: "Engineering",
    duration: "12 weeks",
    level: "Intermediate"
  },
  {
    id: 20,
    title: "Machine Learning",
    description: "Algorithms, neural networks and AI applications",
    image: machineLearning,
    category: "Computer Science",
    duration: "14 weeks",
    level: "Advanced"
  },
  {
    id: 21,
    title: "Medical Coding",
    description: "Healthcare billing and insurance coding systems",
    image: medicalCoding,
    category: "Healthcare",
    duration: "9 weeks",
    level: "Beginner"
  },
  {
    id: 22,
    title: "MS Eeras Certification",
    description: "Comprehensive professional development program",
    image: msEerasProgram,
    category: "Professional Skills",
    duration: "16 weeks",
    level: "All Levels"
  },
  {
    id: 23,
    title: "Web Development",
    description: "Full-stack development with modern frameworks",
    image: webDevelopment,
    category: "Programming",
    duration: "12 weeks",
    level: "Beginner"
  },
  {
    id: 24,
    title: "Stock Market Investing",
    description: "Fundamentals of trading and portfolio management",
    image: stockMarket,
    category: "Finance",
    duration: "6 weeks",
    level: "Beginner"
  },
  {
    id: 25,
    title: "UI/UX Design",
    description: "User-centered design principles and prototyping",
    image: uiUxDesign,
    category: "Design",
    duration: "8 weeks",
    level: "Intermediate"
  },
  {
    id: 26,
    title: "Embedded Systems",
    description: "Programming microcontrollers and hardware interfaces",
    image: embeddedSystems,
    category: "Engineering",
    duration: "10 weeks",
    level: "Advanced"
  }
];

export default courses;