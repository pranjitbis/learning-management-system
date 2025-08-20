import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <video autoPlay muted loop playsInline className={styles.videoBackground}>
        <source src="/header.mp4" type="video/mp4" />
      </video>
      <div className={styles.container}>
        <h1>Unlock Your Potential</h1>
        <p>
          Join millions of learners from around the world. Master new skills,
          and achieve your goals.
        </p>
        <Link href="#courses" className={styles.btnPrimary}>
          Explore Courses
        </Link>
      </div>
    </section>
  );
}
