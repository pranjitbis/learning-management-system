"use client"
import { useState } from 'react';
import Head from 'next/head';
import Nav from "../components/Header/Page";
import Footer from "../components/Footer/Page";
import styles from './CampusAmbassador.module.css';

export default function CampusAmbassador() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className={styles.container}>
      <Head>
        <title>Campus Ambassador Program | Elenxia</title>
        <meta name="description" content="Join Elenxia's Campus Ambassador Program to develop leadership skills, earn a stipend, and represent our innovative company on your campus." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <Nav />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Campus Ambassador Program</h1>
          <p className={styles.heroSubtitle}>
            Represent Elenxia on your campus, develop leadership skills, and earn while you learn!
          </p>
          <div className={styles.heroButtons}>
            <a href="https://forms.gle/ibszgUR9uPqTzn8XA" target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>
              Apply Now
            </a>
            <a href="#benefits" className={styles.secondaryButton}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>About Elenxia</h2>
          <div className={styles.aboutContent}>
            <p className={styles.aboutText}>
              The Campus Ambassador Program is an exciting opportunity for students to represent Elenxia, a dynamic and innovative company, on their campus.
            </p>
            <p className={styles.aboutText}>
              As a verified and authentic Campus Ambassador (CA), you will be the face of Elenxia, helping to spread awareness about our mission, opportunities, and offerings. Your role will involve engaging with fellow students, answering their questions about Elenxia, and guiding them through the process of joining our programs.
            </p>
            <p className={styles.aboutText}>
              This is your chance to develop leadership skills, expand your network, and gain real-world experience while still in college!
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className={`${styles.section} ${styles.benefitsSection}`}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Benefits of Being a Campus Ambassador</h2>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>
                  <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className={styles.benefitContent}>
                  <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                  <p className={styles.benefitDescription}>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className={`${styles.section} ${styles.stepsSection}`}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Steps to Become a Campus Ambassador</h2>
          <div className={styles.stepsIndicator}>
            {[1, 2, 3, 4, 5].map(step => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`${styles.stepButton} ${activeStep === step ? styles.stepButtonActive : ''}`}
              >
                {step}
              </button>
            ))}
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Step {activeStep}</h3>
            <p className={styles.stepDescription}>{steps[activeStep - 1]}</p>
          </div>
        </div>
      </section>

      {/* Why Elenxia Section */}
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Why Choose Elenxia?</h2>
          <div className={styles.whyContent}>
            <p className={styles.whyText}>
              At Elenxia, we believe in empowering students with real-world experience and growth opportunities.
            </p>
            <p className={styles.whyText}>
              As a Campus Ambassador, you'll not only represent a forward-thinking brand but also build skills that set you apart in your career.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`${styles.section} ${styles.ctaSection}`}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to take the first step?</h2>
          <p className={styles.ctaSubtitle}>
            Join us today and become the voice of Elenxia on your campus! 🚀
          </p>
          <a href="https://forms.gle/ibszgUR9uPqTzn8XA" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
            Apply Now
          </a>
          <p className={styles.contactInfo}>
            For queries, contact us at <a href="mailto:hr@elenxia.com" className={styles.contactLink}>hr@elenxia.com</a> or call <a href="tel:+919123064187" className={styles.contactLink}>+91 9123064187</a> / <a href="tel:+918910744174" className={styles.contactLink}>+91 8910744174</a>.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Data for benefits
const benefits = [
  {
    title: "Attractive Stipend",
    description: "Earn more than just pocket money."
  },
  {
    title: "Learn While You Earn",
    description: "Gain valuable corporate exposure alongside your studies."
  },
  {
    title: "Develop Key Skills",
    description: "Enhance your communication, leadership, and marketing abilities."
  },
  {
    title: "Exclusive Certificate",
    description: "Receive a verified and authentic Campus Ambassador certification from Elenxia."
  },
  {
    title: "Networking Opportunities",
    description: "Connect with professionals and like-minded peers."
  },
  {
    title: "Career Advancement",
    description: "Boost your resume with valuable experience from a recognized organization."
  }
];

// Data for steps
const steps = [
  "Register your interest by filling out our Google Form or joining our WhatsApp group.",
  "Get an interview call from our recruitment team.",
  "Ace the interview and showcase your enthusiasm!",
  "Shortlisted candidates will proceed to a second-round interview.",
  "Selected ambassadors will receive an official offer letter and start their journey with Elenxia!"
];