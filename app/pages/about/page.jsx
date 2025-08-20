"use client"
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header/Page';
import Footer from '../../components/Footer/Page';
import styles from './styles/About.module.css';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - Elenxia</title>
        <meta name="description" content="Learn more about Elenxia and our mission" />
      </Head>
      
      <Header />
      
      <section id="about-page" className={styles.pageSection}>
        <div className={styles.pageHero} style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1558021211-6d1403321394?q=80&w=1926&auto=format&fit=crop')`
        }}>
          <Link href="/" className={styles.btnBack}>
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
          <h1>About Us</h1>
        </div>
        
        <div className={styles.aboutContent}>
          <blockquote>
            "Learning knows no limits when you're guided by the right platform and
            the right mentors." – Elenxia
          </blockquote>

          <h3>Who We Are</h3>
          <p>
            At Elenxia, we believe in empowering individuals to strive for
            excellence through industry-relevant courses and expert-led
            mentorship. In today's digital age, where one job can attract hundreds
            of applicants, standing out is no longer a luxury — it's a necessity.
            That's why we focus on practical upskilling through hands-on training
            and real-world projects that prepare you to thrive in the professional
            world.
          </p>

          <h3>Shaping the Innovators of Tomorrow</h3>
          <p>
            Elenxia is a next-gen e-learning ecosystem designed to equip learners
            with cutting-edge skills, starting from the fundamentals to advanced
            expertise. Our carefully crafted programs are developed and delivered
            by industry professionals who are passionate about what they do. With
            a strong emphasis on in-demand skills and real-time project exposure,
            we help you grow both personally and professionally.
          </p>
          <p>
            From flexible online learning to interactive group activities and
            collaborative projects, our platform is designed to make learning
            engaging and career-focused — giving you the competitive edge needed
            to succeed.
          </p>

          <h3>Our Alumni Work At 75+ Industry Leaders</h3>
          <p>
            We're proud that our alumni are contributing to some of the world's
            leading companies, ensuring that the skills they gained with us are
            put into action in real-world scenarios. Our alumni work at:
          </p>
          
          <div className={styles.aboutPartners}>
            {[
              "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
              "https://pngimg.com/d/google_PNG19644.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Tata_Consultancy_Services_old_logo.svg/2560px-Tata_Consultancy_Services_old_logo.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/1280px-Infosys_logo.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Corporate_Logo.png/1200px-Adobe_Corporate_Logo.png"
            ].map((logo, index) => (
              <div className={styles.logoItem} key={index}>
                <Image
                  src={logo}
                  alt={`Company Logo ${index + 1}`}
                  width={120}
                  height={60}
                  className={styles.logoImage}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.aboutContactSection}>
          <h2 className={styles.sectionTitle}>Need Help Choosing the Right Course?</h2>
          <p>
            We're just a message away! Whether you have questions about a course
            or need help navigating your learning journey, our dedicated support
            team is available 24/7 to assist you.
          </p>
          <div className={styles.btnGroup}>
            <Link href="/contact" className={`${styles.btn} ${styles.btnPrimary}`}>
              <i className="fas fa-comments"></i> Talk to Our Experts
            </Link>
            <Link href="/contact" className={`${styles.btn} ${styles.btnSecondary}`}>
              <i className="fas fa-phone-alt"></i> Request a Callback
            </Link>
          </div>
          <p className={styles.disclaimer}>
            By submitting this form, I consent to receive updates and marketing
            communications from Elenxia via Email and WhatsApp. I agree to the
            Terms & Conditions and Privacy Policy.
          </p>
        </div>
      </section>
      
      <Footer />
    </>
  );
}