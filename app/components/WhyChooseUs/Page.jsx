import Image from 'next/image';
import styles from './WhyChooseUs.module.css';

export default function WhyChooseUs() {
  return (
    <section className={styles.whyChooseUs}>
      <h2 className={styles.sectionTitle}>Why Choose Us?</h2>
      <div className={styles.whyChooseUsContainer}>
        <div className={styles.whyChooseUsImage}>
          <Image
            src="https://media.istockphoto.com/id/1205704184/photo/unsure-confused-young-adult-indian-woman-standing-isolated-on-grey-background-copy-space.webp?a=1&b=1&s=612x612&w=0&k=20&c=A2AtEZk4RRJiKRytGlUWksS9UcxtlR5oCX9PeXj3JDI="
            alt="Decorative image with a question mark"
            width={500}
            height={500}
            className={styles.image}
          />
        </div>
        <div className={styles.whyChooseUsContent}>
          <div className={styles.reason}>
            <div className={styles.reasonIcon}><i className="fas fa-user-tie"></i></div>
            <div className={styles.reasonText}>
              <h5>Expert Instructors</h5>
              <p>
                Our platform features highly qualified and experienced
                educators who are passionate about their subject matter.
              </p>
            </div>
          </div>
          <div className={styles.reason}>
            <div className={styles.reasonIcon}><i className="fas fa-chart-line"></i></div>
            <div className={styles.reasonText}>
              <h5>High Success Rate</h5>
              <p>
                We have a track record of helping students achieve their
                educational goals, whether that's hands-on experience or
                mastering a new skill.
              </p>
            </div>
          </div>
          <div className={styles.reason}>
            <div className={styles.reasonIcon}><i className="fas fa-book-open"></i></div>
            <div className={styles.reasonText}>
              <h5>Up-to-Date Curriculum</h5>
              <p>
                The courses we offer are regularly updated to reflect the
                latest developments and best practices in the field.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}