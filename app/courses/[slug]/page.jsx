"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import courses from "../../utils/course";
import Link from "next/link";
import styles from "../CourseDetail.module.css";
import Nav from "../../components/Header/Page";
import Footer from "../../components/Footer/Page";
export default function CourseDetailPage() {
  const { slug } = useParams();
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    return (
      <div className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>Course Not Found</h1>
        <p className={styles.notFoundText}>
          The course you're looking for doesn't exist or may have been removed.
        </p>
        <Link href="/courses" className={styles.enrollButton}>
          Browse All Courses
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.hero}>
            <Image
              src={course.image}
              alt={course.title}
              fill
              className={styles.heroImage}
              priority
            />
          </div>

          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>{course.title}</h1>
            <div className={styles.priceTag}>₹7500</div>
          </div>

          <div className={styles.metaContainer}>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>📚</span>
              {course.category}
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>⏱️</span>
              {course.duration}
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>📈</span>
              {course.level}
            </div>
          </div>

          <p className={styles.description}>{course.shortDescription}</p>
        </div>

        <div className={styles.contentGrid}>
          <main>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Course Overview</h2>
              <p>{course.longDescription}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>What You'll Achieve</h2>
              <div className={styles.featureList}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🎯</div>
                  <h3 className={styles.featureTitle}>Master Key Concepts</h3>
                  <p className={styles.featureDesc}>
                    Gain deep understanding of core {course.category} principles
                    and methodologies.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🛠️</div>
                  <h3 className={styles.featureTitle}>Practical Skills</h3>
                  <p className={styles.featureDesc}>
                    Develop hands-on skills through projects and real-world
                    scenarios.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>📝</div>
                  <h3 className={styles.featureTitle}>Certification</h3>
                  <p className={styles.featureDesc}>
                    Earn a certificate to showcase your expertise to employers.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>👨‍🏫</div>
                  <h3 className={styles.featureTitle}>Expert Guidance</h3>
                  <p className={styles.featureDesc}>
                    Learn from industry professionals with years of experience.
                  </p>
                </div>
              </div>
            </section>
          </main>

          <aside className={styles.sidebar}>
            <div className={styles.enrollCard}>
              <button className={styles.enrollButton}>Enroll Now - ₹750</button>
              <button className={styles.secondaryButton}>Save for Later</button>

              <div className={styles.includesList}>
                <h3 className={styles.sectionTitle}>Course Includes</h3>
                <div className={styles.includesItem}>
                  📼 20+ Hours Video Content
                </div>
                <div className={styles.includesItem}>
                  📖 Downloadable Resources
                </div>
                <div className={styles.includesItem}>🔄 Lifetime Access</div>
                <div className={styles.includesItem}>📱 Mobile & TV Access</div>
                <div className={styles.includesItem}>
                  🏆 Completion Certificate
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
