// existing imports ...
import webDevelopment from "../../public/course/person-front-computer-working-html.jpg";
import uiUxDesign from "../../public/course/UI_UXDesign.avif";

// New image imports
import pythonDataScience from "../../public/course/1597381825584.png";
import pythonAI from "../../public/course/python_ai.jpg";
import pythonML from "../../public/course/python_ml.jpg";
import blockchain from "../../public/course/3d-nft-icon-chain_629802-28.jpg";
import awsCourse from "../../public/course/Amazon_Web_Services_Logo-kl.png";
import msExcelCourse from "../../public/course/MS-Excel-Advanced.jpg";
import sqlCourse from "../../public/course/sql.png";
import cCourse from "../../public/course/C-programming.png";
import cppCourse from "../../public/course/cplusProgramming.png";
import javaCourse from "../../public/course/JAVA.jpg";
import Digital from "../../public/course/Digital-Marketing.jpg";
import cyberSecurityIcon from "../../public/course/cybersecurity-shield-with-lock-data-protection-privacy-concept.jpg";

const courses = [
  {
    id: 27,
    title: "Python for Data Science",
    slug: "python-for-data-science",
    shortDescription:
      "Learn to analyze, visualize, and predict data trends using Python tools.",
    longDescription:
      "Master the art of data analysis and visualization using Python. This course covers essential libraries such as Pandas, NumPy, Matplotlib, and Seaborn. Learn to clean, process, and visualize real-world datasets, build statistical models, and apply Python for predictive analytics. By the end, you’ll be able to transform raw data into actionable insights for business and research applications.",
    image: pythonDataScience,
    category: "Data Science",
    duration: "10 weeks",
    level: "Beginner",
  },
  {
    id: 28,
    title: "Python with Artificial Intelligence",
    slug: "python-with-artificial-intelligence",
    shortDescription:
      "Build intelligent systems using Python and modern AI frameworks.",
    longDescription:
      "Unlock the power of Artificial Intelligence using Python. This course takes you through the fundamentals of AI, including natural language processing, neural networks, and computer vision. Build intelligent systems and automation tools using frameworks like TensorFlow and Keras. Ideal for learners who want to merge coding with intelligence-driven solutions used in modern AI applications.",
    image: pythonAI,
    category: "AI / Machine Learning",
    duration: "12 weeks",
    level: "Intermediate",
  },
  {
    id: 29,
    title: "Python with Machine Learning",
    slug: "python-with-machine-learning",
    shortDescription:
      "Master ML algorithms and predictive models using Python.",
    longDescription:
      "Dive deep into Machine Learning using Python. Learn supervised and unsupervised algorithms, regression, classification, clustering, and model evaluation. Explore libraries such as Scikit-learn and XGBoost, and work on real-world projects like spam detection, stock prediction, and recommendation engines. Perfect for developers and analysts looking to enter the ML domain.",
    image: pythonML,
    category: "Machine Learning",
    duration: "12 weeks",
    level: "Intermediate",
  },
  {
    id: 30,
    title: "Blockchain Development",
    slug: "blockchain-development",
    shortDescription:
      "Learn blockchain, smart contracts, and DApp development from scratch.",
    longDescription:
      "Discover how blockchain is transforming industries. This course introduces distributed ledger technology, smart contracts, and decentralized application (DApp) development. Build your own blockchain prototypes using Solidity and Ethereum. Gain practical knowledge of how blockchain powers cryptocurrencies, NFTs, and decentralized finance (DeFi).",
    image: blockchain,
    category: "Emerging Tech",
    duration: "8 weeks",
    level: "Beginner",
  },
  {
    id: 31,
    title: "AWS Cloud Certification",
    slug: "aws-cloud-certification",
    shortDescription:
      "Master Amazon Web Services and prepare for AWS certification exams.",
    longDescription:
      "Become proficient in Amazon Web Services (AWS) cloud computing. Learn about EC2, S3, IAM, Lambda, and networking in AWS. Prepare for the AWS Certified Solutions Architect exam through hands-on projects that simulate real-world cloud scenarios. Build scalable, reliable, and cost-efficient cloud applications with confidence.",
    image: awsCourse,
    category: "Cloud / DevOps",
    duration: "8 weeks",
    level: "Intermediate",
  },
  {
    id: 32,
    title: "UI / UX Design",
    slug: "ui-ux-design",
    shortDescription:
      "Create intuitive and visually engaging digital user experiences.",
    longDescription:
      "Master the principles of user interface and user experience design. This course guides you through design thinking, wireframing, prototyping, and usability testing using tools like Figma and Adobe XD. Learn how to create intuitive interfaces that deliver delightful digital experiences for web and mobile users.",
    image: uiUxDesign,
    category: "Design",
    duration: "8 weeks",
    level: "Intermediate",
  },
  {
    id: 33,
    title: "Digital Marketing",
    slug: "digital-marketing",
    shortDescription:
      "Boost your career by mastering SEO, social media, and online ads.",
    longDescription:
      "Build your digital presence with our comprehensive digital marketing course. Learn SEO, SEM, Google Ads, email marketing, and social media strategy. Gain practical skills in analytics, lead generation, and conversion optimization to help brands grow online visibility and revenue.",
    image: Digital,
    category: "Marketing",
    duration: "6 weeks",
    level: "Beginner",
  },
  {
    id: 34,
    title: "MS Excel & Data Analysis",
    slug: "ms-excel-data-analysis",
    shortDescription:
      "Enhance your data analytics skills using Excel dashboards and formulas.",
    longDescription:
      "Take your Excel skills to the next level with advanced formulas, pivot tables, macros, and dashboards. Learn how to analyze large datasets efficiently and visualize results effectively. This course is ideal for professionals who want to make data-driven decisions using Excel as their main analytical tool.",
    image: msExcelCourse,
    category: "Business / Analytics",
    duration: "6 weeks",
    level: "Beginner",
  },
  {
    id: 35,
    title: "SQL & Database Fundamentals",
    slug: "sql-database-fundamentals",
    shortDescription:
      "Understand databases and master SQL queries for real-world use.",
    longDescription:
      "Understand how databases power modern applications. Learn SQL from the ground up — from creating tables to writing complex joins, subqueries, and stored procedures. Work with real datasets and design relational databases that are efficient and scalable.",
    image: sqlCourse,
    category: "Database",
    duration: "8 weeks",
    level: "Beginner",
  },
  {
    id: 36,
    title: "Programming in C",
    slug: "programming-in-c",
    shortDescription:
      "Start coding by learning C — the foundation of modern programming.",
    longDescription:
      "Start your programming journey with the C language — the foundation of all modern programming. Learn about data types, arrays, pointers, memory management, and control structures. This course emphasizes logic-building and problem-solving techniques essential for every programmer.",
    image: cCourse,
    category: "Programming",
    duration: "6 weeks",
    level: "Beginner",
  },
  {
    id: 37,
    title: "C++ Programming",
    slug: "cplus-plus-programming",
    shortDescription:
      "Advance your coding with object-oriented concepts in C++.",
    longDescription:
      "Take your coding skills to the next level with C++. Learn object-oriented programming, classes, inheritance, and polymorphism. Explore advanced concepts like templates, STL, and file handling. Build efficient and scalable programs while developing the mindset of a professional software engineer.",
    image: cppCourse,
    category: "Programming",
    duration: "8 weeks",
    level: "Intermediate",
  },
  {
    id: 38,
    title: "Java Development",
    slug: "java-development",
    shortDescription:
      "Develop enterprise-level applications using Java and Spring Boot.",
    longDescription:
      "Build robust and scalable applications using Java. This course covers Java fundamentals, OOP concepts, collections, exception handling, and file I/O. You’ll also explore frameworks like Spring Boot to develop enterprise-level web applications and APIs.",
    image: javaCourse,
    category: "Programming",
    duration: "10 weeks",
    level: "Intermediate",
  },
  {
    id: 39,
    title: "Cybersecurity Fundamentals",
    slug: "cybersecurity-fundamentals",
    shortDescription:
      "Learn to protect systems and data from online threats and attacks.",
    longDescription:
      "Protect systems and data from cyber threats. Learn about encryption, network security, ethical hacking, malware analysis, and risk management. This course equips you with the skills to detect, prevent, and respond to cybersecurity incidents in an increasingly connected digital world.",
    image: cyberSecurityIcon,
    category: "Information Security",
    duration: "10 weeks",
    level: "Intermediate",
  },
];

export default courses;

