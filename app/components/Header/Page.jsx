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
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setIsDarkMode(savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (href) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className={styles.header}>
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
        >
          <span className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        
        <div className={`${styles.navWrapper} ${isMenuOpen ? styles.active : ''}`}>
          <nav>
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
                <span className={`${styles.navLink} ${pathname.startsWith('/courses') ? styles.active : ''}`}>
                  Courses <i className="fas fa-chevron-down"></i>
                </span>
                <div className={styles.dropdownContent}>
                  <Link 
                    href="/courses/web-development" 
                    className={isActive('/courses/web-development') ? styles.active : ''}
                  >
                    Web Development
                  </Link>
                  <Link 
                    href="/courses/data-science" 
                    className={isActive('/courses/data-science') ? styles.active : ''}
                  >
                    Data Science
                  </Link>
                  <Link 
                    href="/courses/cyber-security" 
                    className={isActive('/courses/cyber-security') ? styles.active : ''}
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
              className={`${styles.btnLogin} ${isActive('/login') ? styles.active : ''}`}
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className={`${styles.btnRegister} ${isActive('/register') ? styles.active : ''}`}
            >
              Register
            </Link>
            <button
              className={styles.themeButton}
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}