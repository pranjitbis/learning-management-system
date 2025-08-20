import Image from "next/image";
import styles from "../CoursePage.module.css";
import courseImage from "../../../public/course/futuristic-technology-hologram.jpg";
import Nav from "../../components/Header/Page"

export default function DataScienceCourse() {
  return (
    <div>
      <Nav />
      <main className={styles.container}>
        <div className={styles.hero}>
          <Image
            src={courseImage}
            alt="Data Science"
            fill
            className={styles.heroImage}
          />
          <div className={styles.heroContent}>
            <h1>Data Science & Machine Learning</h1>
            <p>
              Learn Python, Pandas, NumPy, and ML algorithms with real datasets
            </p>
            <button className={styles.ctaButton}>Enroll Now - ₹4,499</button>
          </div>
        </div>

        <section className={styles.courseDetails}>
          <div className={styles.overview}>
            <h2>Why This Course?</h2>
            <p>
              Designed for students who want to break into data science with
              practical, project-based learning.
            </p>

            <div className={styles.curriculum}>
              <h3>Curriculum Highlights</h3>
              <ul>
                <li>Python for Data Analysis</li>
                <li>Data Visualization</li>
                <li>Machine Learning Fundamentals</li>
              </ul>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.pricingCard}>
              <h3>Limited Time Offer</h3>
              <div className={styles.price}>
                ₹4,499 <span>₹8,999</span>
              </div>
              <button className={styles.enrollButton}>
                Start Learning Today
              </button>
              <p className={styles.studentDiscount}>
                Student pricing available
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
