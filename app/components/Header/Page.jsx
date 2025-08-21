"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/logo/Elenxia_Colored_NoTag.svg';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Update data-theme attribute and localStorage
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    
    // Update body background color
    document.body.style.backgroundColor = newMode ? 'var(--background)' : 'var(--bg-primary)';
  };

  const toggleDropdown = (dropdownName) => {
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set initial body background color
    document.body.style.backgroundColor = isDark ? 'var(--background)' : 'var(--bg-primary)';
    document.body.style.transition = 'background-color 0.3s ease';

    // Handle scroll event for sticky header
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const isActive = (href) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.logo}>
          <Image 
            src={logo} 
            alt="Elenxia Logo" 
            width={150} 
            height={45} 
            priority
          />
        </Link>
        
        <button
          className={styles.navToggle}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
        >
          <span className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}>
            <span className={styles.hamburgerBox}>
              <span className={styles.hamburgerInner}></span>
            </span>
          </span>
        </button>
        
        <div className={`${styles.navWrapper} ${isMenuOpen ? styles.active : ''}`}>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li>
                <Link 
                  href="/" 
                  className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
                >
                  Home
                </Link>
              </li>
              
              <li className={styles.dropdown}>
                <button 
                  className={`${styles.navLink} ${styles.dropdownToggle} ${pathname.startsWith('/courses') ? styles.active : ''}`}
                  onClick={() => toggleDropdown('courses')}
                  aria-expanded={activeDropdown === 'courses'}
                >
                  Courses
                  <svg 
                    className={`${styles.dropdownChevron} ${activeDropdown === 'courses' ? styles.rotated : ''}`} 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`${styles.dropdownContent} ${activeDropdown === 'courses' ? styles.show : ''}`}>
                  <Link 
                    href="/courses/web-development" 
                    className={`${styles.dropdownLink} ${isActive('/courses/web-development') ? styles.active : ''}`}
                  >
                    Web Development
                  </Link>
                  <Link 
                    href="/courses/data-science" 
                    className={`${styles.dropdownLink} ${isActive('/courses/data-science') ? styles.active : ''}`}
                  >
                    Data Science
                  </Link>
                  <Link 
                    href="/courses/cyber-security" 
                    className={`${styles.dropdownLink} ${isActive('/courses/cyber-security') ? styles.active : ''}`}
                  >
                    Cyber Security
                  </Link>
                </div>
              </li>
              
              <li>
                <Link 
                  href="/programs" 
                  className={`${styles.navLink} ${isActive('/programs') ? styles.active : ''}`}
                >
                  Programs
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className={`${styles.navLink} ${isActive('/contact') ? styles.active : ''}`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className={styles.headerActions}>
            <Link 
              href="/login" 
              className={`${styles.btn} ${styles.btnLogin} ${isActive('/login') ? styles.active : ''}`}
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className={`${styles.btn} ${styles.btnRegister} ${isActive('/register') ? styles.active : ''}`}
            >
              Register
            </Link>
           
          </div>
        </div>
      </div>
    </header>
  );
}