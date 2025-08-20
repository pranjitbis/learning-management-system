"use client"
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header/Page';
import Footer from '../../components/Footer/Page';
import styles from './Contact.module.css';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    contact: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    alert('Form submitted successfully!');
  };

  return (
    <>
      <Head>
        <title>Contact Us - Elenxia</title>
        <meta name="description" content="Get in touch with Elenxia" />
      </Head>
      
      <Header />
      
      <section id="contact-page" className={styles.pageSection}>
        <div className={styles.pageHero} style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1554232456-8727a67f2b54?q=80&w=1935&auto=format&fit=crop')`
        }}>
          <Link href="/" className={styles.btnBack}>
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
          <h1>Contact Us</h1>
        </div>
        
        <div className={styles.contactPage}>
          <div className={styles.formContainer}>
            <h2 className={styles.sectionTitle}>Get in Touch</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email ID</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="college">College Name</label>
                <input 
                  type="text" 
                  id="college" 
                  name="college" 
                  value={formData.college}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="contact">Contact Number</label>
                <input 
                  type="tel" 
                  id="contact" 
                  name="contact" 
                  value={formData.contact}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="message">Your Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <button type="submit" className={styles.submitButton}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}