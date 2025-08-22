"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./CourseCard.module.css";

export default function CourseCard({ course }) {
  return (
    <div className={styles.courseCard}>
      <Image
        src={course.image}
        alt={course.title}
        width={350}
        height={220}
        className={styles.cardImage}
      />
      <div className={styles.cardContent}>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className={styles.cardFooter}>
          <div className={styles.coursePrice}>₹7500</div>
          <Link href={`/courses/${course.id}`}>
            <button className={styles.detailsButton}>View Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
