import Image from 'next/image';
import styles from "./Programs.module.css";
import heroImage from '../../../public/';

export default function Programs() {
  const programs = [
    {
      title: "Summer Internship Program",
      description: "8-week intensive for college students",
      cta: "Apply Now",
      image: "/programs/summer-internship.jpg"
    },
    // Add more programs
  ];

  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <Image src={heroImage} alt="Our Programs" fill className={styles.heroImage} />
        <div className={styles.heroContent}>
          <h1>Transformative Learning Programs</h1>
          <p>Designed specifically for college students and early-career professionals</p>
        </div>
      </div>

      <section className={styles.programList}>
        <h2>Featured Programs</h2>
        <div className={styles.programGrid}>
          {programs.map((program, index) => (
            <div key={index} className={styles.programCard}>
              <div className={styles.programImage}>
                <Image src={program.image} alt={program.title} fill />
              </div>
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <button className={styles.programButton}>{program.cta}</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}