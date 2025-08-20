import Image from "next/image";
import styles from "./styles/About.module.css";
import aboutImage from "../../public/istockphoto-1321029825-612x612.jpg"; // Change to your actual image
import Nav from '../components/Header/Page'
export default function AboutPage() {
  return (
    <div>
      <Nav />
      <main className={styles.aboutContainer}>
        <section className={styles.heroSection}>
          <div className={styles.textContent}>
            <h1>Who We Are</h1>
            <p>
              At <strong>Elenxia</strong>, we believe in empowering individuals
              to strive for excellence through industry-relevant courses and
              expert-led mentorship. In today’s digital age, where one job can
              attract hundreds of applicants, standing out is no longer a luxury
              — it’s a necessity.
            </p>
            <p>
              That’s why we focus on practical upskilling through hands-on
              training and real-world projects that prepare you to thrive in the
              professional world.
            </p>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src={aboutImage}
              alt="Elenxia Team"
              fill
              className={styles.aboutImage}
              priority
            />
          </div>
        </section>

        {/* Vision Section */}
        <section className={styles.visionSection}>
          <h2>Shaping the Innovators of Tomorrow</h2>
          <p>
            Elenxia is a next-gen e-learning ecosystem designed to equip
            learners with cutting-edge skills, starting from the fundamentals to
            advanced expertise. Our carefully crafted programs are developed and
            delivered by industry professionals who are passionate about what
            they do.
          </p>
          <p>
            With a strong emphasis on in-demand skills and real-time project
            exposure, we help you grow both personally and professionally.
          </p>
          <p>
            From flexible online learning to interactive group activities and
            collaborative projects, our platform is designed to make learning
            engaging and career-focused — giving you the competitive edge needed
            to succeed.
          </p>
        </section>
      </main>
    </div>
  );
}
