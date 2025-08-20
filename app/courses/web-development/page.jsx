import Image from "next/image";
import styles from "../CoursePage.module.css";
import Nav from "../../components/Header/Page"
import courseImage from "../../../public/course/person-front-computer-working-html.jpg";
import certificate from "../../../public/certificate.webp";
export default function WebDevelopmentCourse() {
  return (
    <div>
        <Nav />
        <main className={styles.container}>
      <div className={styles.hero}>
        <Image
          src={courseImage}
          alt="Web Development"
          fill
          className={styles.heroImage}
        />
        <div className={styles.heroContent}>
          <h1>Full Stack Web Development</h1>
          <p>
            Master HTML, CSS, JavaScript, React, Node.js and build real-world
            projects
          </p>
          <button className={styles.ctaButton}>Enroll Now - ₹3,999</button>
        </div>
      </div>

      <section className={styles.courseDetails}>
        <div className={styles.overview}>
          <h2>Course Overview</h2>
          <p>
            Perfect for college students, this course teaches you modern web
            development through hands-on projects you can add to your portfolio.
          </p>

          <div className={styles.features}>
            <div className={styles.featureCard}>
              <Image
                src={certificate}
                width={40}
                height={40}
                alt="Certificate"
              />
              <h3>Get Certified</h3>
              <p>Earn a certificate to showcase to employers</p>
            </div>
            {/* Add more feature cards */}
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.pricingCard}>
            <h3>Enroll Today</h3>
            <div className={styles.price}>
              ₹3,999 <span>₹7,999</span>
            </div>
            <button className={styles.enrollButton}>
              Join 5,000+ Students
            </button>
            <p className={styles.studentDiscount}>
              50% student discount applied
            </p>
          </div>
        </div>
      </section>
    </main>
    </div>
  );
}
