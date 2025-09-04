import styles from "./Contact.module.css";
import Nav from "../components/Header/Page";
import Footer from "../components/Footer/Page";

export default function ContactPage() {
  return (
    <main className={styles.contactContainer}>
      <Nav />
      
      <div className={styles.heroSection}>
        <h1 className={styles.pageTitle}>Get in Touch</h1>
        <p className={styles.pageSubtitle}>
          Have questions? We'd love to hear from you. Fill out the form and our
          team will get back to you as soon as possible.
        </p>
      </div>

      <div className={styles.contentWrapper}>
   

        <div className={styles.infoSection}>
          <div className={styles.infoWrapper}>
            <h2>Contact Information</h2>
            <p className={styles.infoDescription}>
              Have questions about our courses or need help with registration? Our
              team is here to assist you.
            </p>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>✉</div>
              <div className={styles.infoContent}>
                <strong>Email</strong>
                <span>support@elenxia.com</span>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>📞</div>
              <div className={styles.infoContent}>
                <strong>Phone</strong>
                <span>+91 98765 43210</span>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>📍</div>
              <div className={styles.infoContent}>
                <strong>Address</strong>
                <span>123 Learning Street, New Delhi, India</span>
              </div>
            </div>
            
            <div className={styles.socialLinks}>
              <h3>Follow Us</h3>
              <div className={styles.socialIcons}>
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Twitter">🐦</a>
                <a href="#" aria-label="Instagram">📸</a>
                <a href="#" aria-label="LinkedIn">💼</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer className={styles.footerC} />
    </main>
  );
}