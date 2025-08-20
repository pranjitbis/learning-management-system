import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerColumn}>
          <Link href="/" className={`${styles.logo} ${styles.homeLinkLogo}`}>
            <Image 
              src="/images/Elenxia_Web_Logo_Color.png" 
              alt="Elenxia Logo" 
              width={150} 
              height={50} 
            />
          </Link>
          <p>
            Skills are honed through experience, but true mastery comes from a
            thirst for knowledge and a commitment to continuous learning.
          </p>
        </div>
        
        <div className={styles.footerColumn}>
          <h4>Contact Info</h4>
          <ul>
            <li>
              <i className="fas fa-envelope"></i>
              <a href="mailto:support@elenxia.com">support@elenxia.com</a>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <a href="tel:+918910744174">8910744174</a>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <a href="tel:+919123064157">9123064157</a>
            </li>
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Astra+Towers,+Action+Area+IIC,+Newtown,+New+Town,+West+Bengal+700161"
                target="_blank"
                rel="noopener noreferrer"
              >
                Astra Towers, Newtown, West Bengal
              </a>
            </li>
          </ul>
          
          <div className={styles.footerSocials}>
            <a
              href="https://www.linkedin.com/company/elenxia-com?trk=blended-typeahead"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="https://www.instagram.com/elenxia_edutech?igsh=eGpoZDJtNnpwc3N4"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://chat.whatsapp.com/K37ojP7F25Q0IxrHsWpxnb?mode=ems_wa_c&utm_source=igios&utm_campaign=wa_communities_url_xma&source_surface=25"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
        
        <div className={styles.footerColumn}>
          <h4>Office Hours</h4>
          <ul>
            <li>Mon - Thus: 09:00am to 11:00pm</li>
            <li>Fri - Sat: 8:00am to 11:00pm</li>
            <li>Sun: 24 Hrs Open</li>
          </ul>
        </div>
        
        <div className={styles.footerColumn}>
          <h4>Useful Links</h4>
          <ul>
            <li><Link href="/about" id="footer-about-link">About</Link></li>
            <li>
              <Link href="/campus-ambassador" id="campus-ambassador-link">Campus Ambassador</Link>
            </li>
            <li><Link href="/terms" id="terms-link">Terms & Conditions</Link></li>
            <li><Link href="/privacy-policy" id="privacy-policy-link">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>© 2025 Elenxia. All rights reserved.</p>
      </div>
    </footer>
  );
}