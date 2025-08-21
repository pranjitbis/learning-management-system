// app/unauthorized/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaArrowLeft, FaHome, FaSignInAlt } from 'react-icons/fa';
import styles from "./courses.module.css";

export default function Unauthorized() {
  const [countdown, setCountdown] = useState(10);
  const [fromPath, setFromPath] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get the 'from' parameter from the URL
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const from = searchParams.get('from');
      if (from) {
        setFromPath(from);
      }
    }
  }, []);

  useEffect(() => {
    // Countdown timer for automatic redirect
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/login');
    }
  }, [countdown, router]);

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className={styles.unauthorizedContainer}>
      <div className={styles.unauthorizedContent}>
        <div className={styles.iconContainer}>
          <FaLock size={64} className={styles.lockIcon} />
        </div>
        
        <h1 className={styles.title}>Unauthorized Access</h1>
        
        <p className={styles.message}>
          You don't have permission to access this page. Please log in with appropriate credentials.
        </p>

        {fromPath && (
          <p className={styles.detail}>
            Attempted to access: <code>{fromPath}</code>
          </p>
        )}

        <div className={styles.countdown}>
          <p>Redirecting to login in {countdown} seconds...</p>
        </div>

        <div className={styles.buttonGroup}>
          <button 
            onClick={handleGoBack}
            className={styles.secondaryButton}
          >
            <FaArrowLeft /> Go Back
          </button>
          
          <button 
            onClick={handleGoHome}
            className={styles.secondaryButton}
          >
            <FaHome /> Go Home
          </button>
          
          <button 
            onClick={handleLogin}
            className={styles.primaryButton}
          >
            <FaSignInAlt /> Login Now
          </button>
        </div>

        <div className={styles.helpSection}>
          <h3>Need Help?</h3>
          <p>
            If you believe you should have access to this page, please contact your administrator
            or check your login credentials.
          </p>
          <a href="mailto:support@yourcompany.com" className={styles.supportLink}>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}