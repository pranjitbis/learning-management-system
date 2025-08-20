import Head from 'next/head';
import Header from './components/Header/Page';
import Hero from './components/Hero/Page';
import WhyChooseUs from './components/WhyChooseUs/Page';
import HiringPartners from './components/HiringPartners/Page';
import Process from './components/Process/Page';
import Footer from './components/Footer/Page';
import CourseCard from './components/CourseCard/Page';
import TestimonialSlider from './components/TestimonialSlider/Page'
import styles from './styles/Home.module.css';
import courses from './utils/course'

export default function Home() {


  return (
    <>
      <Head>
        <title>Elenxia - Unlock Your Potential</title>
        <meta name="description" content="Join millions of learners from around the world" />
      </Head>
      
      <Header />
      
      <main>
        <Hero  />
        
        <section className={styles.items}>
          <div>
            <h2 className={styles.sectionTitle}>Explore Our Courses</h2>
            <div className={styles.courseSlider}>
              {[...courses, ...courses].map((course, index) => (
                <CourseCard key={`${course.id}-${index}`} course={course} />
              ))}
            </div>
          </div>
        </section>
        
        <WhyChooseUs />
        <HiringPartners />
        <Process />
         <TestimonialSlider />
      </main>
      
      <Footer />
    </>
  );
}