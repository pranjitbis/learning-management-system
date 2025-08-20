"use client";

import { useRef, useEffect } from "react";
import styles from "./TestimonialSlider.module.css";

const testimonials = [
  {
    name: "Abhirup Bag",
    role: "Pursuing B.C.A.",
    text: "Excited to share that I secured 7th place in the Elenxia Hackathon! This experience challenged my tech skills and fueled my passion for problem-solving. Grateful for the opportunity.",
    initials: "AB",
    rating: 4,
  },
  {
    name: "Nisha Sanghai",
    role: "Graphic Designer Intern",
    text: "Thrilled to share that I have successfully completed a 3-month internship... Grateful to Cosmofeed and Elenxia for this opportunity and support.",
    initials: "NS",
    rating: 5,
  },
  {
    name: "Tejaswini Bhagat",
    role: "Ex-intern @Elenxia",
    text: "I am excited to announce that I have successfully completed a three-month mentored Python with Data Science with Elenxia Learning Platform! Always eager to explore new technologies.",
    initials: "TB",
    rating: 5,
  },
  {
    name: "Pritha Halder",
    role: "Student at Kalinga Institute",
    text: "I recently participated in an online internship program organised by Elenxia and Cosmofeed... The course was engaged with amazing lectures. I learned a lot and benefited from this course.",
    initials: "PH",
    rating: 4,
  },
  {
    name: "Aadhya Singh",
    role: "Pre-final Year CSE Student",
    text: "I am thrilled to share that I have just completed a mentored Python with Data Science with Elenxia Learning Platform! Over the past month, I've delved deep into the world of data science.",
    initials: "AS",
    rating: 5,
  },
];

export default function TestimonialSlider() {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    let animationId;

    const start = () => {
      slider.style.animationPlayState = "running";
    };
    const stop = () => {
      slider.style.animationPlayState = "paused";
    };

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);

    start();

    return () => {
      slider.removeEventListener("mouseenter", stop);
      slider.removeEventListener("mouseleave", start);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={styles.sliderWrapper}>
        <h2>What Our Students Say</h2>
      <div className={styles.slider} ref={sliderRef}>
        {[...testimonials, ...testimonials].map((t, i) => (
          <div className={styles.card} key={i}>
            <div className={styles.flex}>
              <div className={styles.avatar}>{t.initials}</div>
              <h3 className={styles.name}>{t.name}</h3>
            </div>
            <p className={styles.role}>{t.role}</p>
            <div className={styles.rating}>
              {"★".repeat(t.rating)}
              {"☆".repeat(5 - t.rating)}
            </div>
            <p className={styles.text}>"{t.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
