import styles from "./Contact.module.css";

export default function ContactPage() {
  return (
    <main className={styles.contactContainer}>
      <h1 className={styles.pageTitle}>Get in Touch</h1>
      <p className={styles.pageSubtitle}>
        Have questions? We’d love to hear from you. Fill out the form and our
        team will get back to you as soon as possible.
      </p>

      <section className={styles.contactContent}>
        {/* Contact Form */}
        <div className={styles.formWrapper}>
          <form className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" name="name" placeholder="John Doe" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Write your message..."
                rows="5"
              ></textarea>
            </div>

            <button type="submit" className={styles.submitButton}>
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className={styles.infoWrapper}>
          <h2>Contact Information</h2>
          <p>
            Have questions about our courses or need help with registration? Our
            team is here to assist you.
          </p>

          <div className={styles.infoItem}>
            <strong>Email:</strong> support@elenxia.com
          </div>
          <div className={styles.infoItem}>
            <strong>Phone:</strong> +91 98765 43210
          </div>
          <div className={styles.infoItem}>
            <strong>Address:</strong> 123 Learning Street, New Delhi, India
          </div>
        </div>
      </section>
    </main>
  );
}
