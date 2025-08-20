import Image from 'next/image';
import styles from './HiringPartners.module.css';
import { hiringPartners } from '../../utils/constants';

export default function HiringPartners() {
  return (
    <section className={styles.hiringPartners}>
      <h2 className={styles.sectionTitle}>Our Alumni Work At The Best Companies</h2>
      <div className={styles.logoSliderContainer}>
        <div className={styles.logoSliderTrack}>
          {[...hiringPartners, ...hiringPartners].map((logo, index) => (
            <div className={styles.logoItem} key={index}>
              <Image
                src={logo.image}
                alt={`Company Logo ${index + 1}`}
                width={150}
                height={80}
                className={styles.logoImage}
              />
            </div>
          ))}
          {[...hiringPartners, ...hiringPartners].map((logo, index) => (
            <div className={styles.logoItem} key={index}>
              <Image
                src={logo.image}
                alt={`Company Logo ${index + 1}`}
                width={150}
                height={80}
                className={styles.logoImage}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}