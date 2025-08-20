import Image from 'next/image';
import styles from '../CoursePage.module.css';
import courseImage from '../../../public/course/cybersecurity-shield-with-lock-data-protection-privacy-concept.jpg';
import Nav from "../../components/Header/Page"
export default function CyberSecurityCourse() {
  return (
   <div>
    <Nav />
     <main className={styles.container}>
      <div className={styles.hero}>
        <Image src={courseImage} alt="Cyber Security" fill className={styles.heroImage} />
        <div className={styles.heroContent}>
          <h1>Cyber Security Essentials</h1>
          <p>Learn ethical hacking, network security, and penetration testing</p>
          <button className={styles.ctaButton}>Enroll Now - ₹4,999</button>
        </div>
      </div>

      <section className={styles.courseDetails}>
        <div className={styles.overview}>
          <h2>Course Benefits</h2>
          <p>Gain in-demand security skills that complement any tech degree.</p>
          
          <div className={styles.features}>
            <div className={styles.featureCard}>
              <Image src="/icons/lab.svg" width={40} height={40} alt="Labs" />
              <h3>Hands-On Labs</h3>
              <p>Practice in our virtual security lab</p>
            </div>
            {/* Add more feature cards */}
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.pricingCard}>
            <h3>Secure Your Future</h3>
            <div className={styles.price}>₹4,999 <span>₹9,999</span></div>
            <button className={styles.enrollButton}>Get Certified</button>
            <p className={styles.studentDiscount}>Includes exam voucher</p>
          </div>
        </div>
      </section>
    </main>
   </div>
  );
}