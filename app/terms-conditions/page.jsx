"use client";

import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header/Page";
import Footer from "../components/Footer/Page";
import styles from "./style.module.css";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms and Conditions - Elenxia</title>
        <meta name="description" content="Elenxia Terms and Conditions" />
      </Head>

      <Header />

      <section id="terms-page" className={styles.pageSection}>
        <div
          className={styles.pageHero}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          <Link href="/" className={styles.btnBack}>
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
          <h1>Terms and Conditions</h1>
          <p>Last updated: September 4, 2025</p>
        </div>

        <div className={styles.termsContainer}>
          <div className={styles.termsContent}>
            <div className={styles.termsIntro}>
              <p>
                Welcome to Elenxia! These Terms and Conditions govern your use
                of our website and services. By accessing or using Elenxia, you
                agree to comply with and be bound by these terms.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>1. Applicability</h2>
              <p>
                These Terms and Conditions apply only to information collected
                via the Elenxia Website. They do not cover offline practices or
                information shared via other means unless expressly stated.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>2. Information We Collect</h2>

              <h3>A. Personally Identifiable Information (PII)</h3>
              <p>
                Elenxia may collect personal data from you in various ways,
                including (but not limited to):
              </p>
              <ul>
                <li>
                  Information you voluntarily submit through forms on our
                  Website
                </li>
                <li>
                  Information shared during communication with us (via email,
                  phone, or support chats)
                </li>
                <li>Details provided through surveys or feedback forms</li>
              </ul>

              <h3>B. Non-Personal Information</h3>
              <p>
                When you access our Website, we automatically gather certain
                technical data, which does not directly identify you:
              </p>
              <ul>
                <li>Browser type and version</li>
                <li>IP address</li>
                <li>Operating system</li>
                <li>Referral URLs and exit pages</li>
                <li>Clickstream data and session duration</li>
                <li>Location (approximate)</li>
                <li>Device information</li>
              </ul>
              <p>
                This data is used for analytics, troubleshooting, and enhancing
                site performance. It is not linked to your identity.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>3. Use of Cookies and Similar Technologies</h2>
              <p>
                We use cookies (small text files stored on your device) to
                enhance your user experience. Cookies help us:
              </p>
              <ul>
                <li>Recognize returning users</li>
                <li>Personalize content based on preferences</li>
                <li>Analyze traffic and usage trends</li>
                <li>Accelerate login and search functionality</li>
              </ul>
              <p>
                You can disable cookies through your browser settings, although
                doing so may restrict access to some features of the Website.
              </p>
              <p>
                We may also use web beacons and tracking pixels in emails to
                determine open rates or interactions. Third-party services
                (e.g., analytics or payment gateways) may also use cookies,
                which are governed by their own privacy policies.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>4. Use of Your Information</h2>
              <p>
                Your information may be used for purposes including but not
                limited to:
              </p>
              <ul>
                <li>Operating and maintaining the Website</li>
                <li>Enhancing performance, design, and functionality</li>
                <li>
                  Communicating with you regarding services, updates, or support
                </li>
                <li>Delivering personalized experiences</li>
                <li>Processing transactions and managing billing</li>
                <li>Complying with legal or regulatory obligations</li>
                <li>Monitoring for fraud or abuse</li>
                <li>
                  Sending newsletters or promotional materials (with your
                  consent)
                </li>
              </ul>
            </div>

            <div className={styles.termsSection}>
              <h2>5. Sharing and Disclosure of Information</h2>
              <p>
                Elenxia does <strong>not</strong> sell, rent, or lease your
                personal information to third parties.
              </p>
              <p>
                We may share your information only in the following scenarios:
              </p>
              <ul>
                <li>
                  With your prior consent (e.g., referrals or partnerships)
                </li>
                <li>
                  To trusted service providers, including:
                  <ul>
                    <li>Payment processors</li>
                    <li>Hosting providers</li>
                    <li>Email communication platforms</li>
                    <li>Legal, accounting, or security consultants</li>
                  </ul>
                </li>
                <li>
                  In the event of a business transaction, such as a merger,
                  acquisition, or sale, subject to confidentiality agreements
                </li>
                <li>
                  To comply with applicable laws, court orders, or legal
                  processes
                </li>
                <li>
                  To enforce our Terms of Use or protect Elenxia's rights and
                  property
                </li>
              </ul>
              <p>
                We may also store user information on third-party servers,
                governed by their respective privacy and security policies.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>6. Your Choices</h2>
              <p>You may:</p>
              <ul>
                <li>
                  Decline to provide personal data; however, this may limit your
                  access to certain services
                </li>
                <li>
                  Update or correct your account information at any time by
                  logging in
                </li>
                <li>
                  Opt out of promotional communications by unsubscribing through
                  links provided in emails
                </li>
              </ul>
              <p>
                To request deletion of your account or personal data, please
                contact us at{" "}
                <a href="mailto:support@elenxia.com">support@elenxia.com</a>.
                Note that we are not responsible for data shared with third
                parties prior to your deletion request.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>7. Data Security</h2>
              <p>
                We employ industry-standard safeguards to protect your data,
                including:
              </p>
              <ul>
                <li>Secure Socket Layer (SSL) encryption</li>
                <li>Firewalls and intrusion detection</li>
                <li>Role-based access control</li>
                <li>Regular security audits and updates</li>
              </ul>
              <p>
                Despite our efforts, no method of data transmission over the
                Internet is 100% secure. Users are responsible for securing
                their login credentials and practicing safe browsing habits.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>8. Data Transfers and Storage</h2>
              <p>
                Your information may be stored or processed on servers located
                outside your country of residence. By using the Website, you
                consent to the transfer of your data to such jurisdictions.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>9. Third-Party Services</h2>
              <p>
                Our Website may include links to or integrations with
                third-party platforms (e.g., payment gateways or analytics
                tools). We are not responsible for the privacy practices or
                policies of these external entities.
              </p>
              <p>
                We recommend reviewing their privacy policies before sharing any
                personal data with them.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>10. Links to External Sites</h2>
              <p>
                Our Website may occasionally link to other sites operated by
                partners or affiliates. These sites are not governed by this
                Privacy Policy, and Elenxia disclaims any responsibility for
                their content, practices, or privacy standards.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>11. Children's Privacy</h2>
              <p>
                Elenxia's services are intended for users aged 18 and above. We
                do not knowingly collect or solicit personal information from
                minors. If you believe a child has provided us with personal
                data, please contact us for immediate removal.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>12. Exclusion of Unsolicited Information</h2>
              <p>
                Any unsolicited information provided by you via public forums or
                unprotected communication channels shall be deemed
                non-confidential. Elenxia reserves the right to use or disclose
                such information without limitation.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>13. Severability</h2>
              <p>
                If any portion of this Policy is found to be invalid or
                unenforceable under applicable law, such part shall be modified
                to the minimum extent necessary or deemed severed, without
                affecting the remainder of the Policy.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>14. Governing Law and Jurisdiction</h2>
              <p>
                This Policy shall be governed by and construed in accordance
                with the laws of India. Any disputes arising under this Policy
                shall fall under the exclusive jurisdiction of the courts of
                Kolkata, West Bengal.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>15. International Use and Jurisdiction</h2>
              <p>
                Elenxia makes no representation that content on the Website is
                appropriate for use outside India. Users who access the Website
                from other regions do so at their own initiative and are
                responsible for compliance with local laws.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>16. Policy Changes</h2>
              <p>
                We reserve the right to update or amend this Privacy Policy as
                required by law or business practices. The most recent version
                will always be available on the Website. Your continued use of
                the Website after such updates constitutes your acceptance of
                the revised policy.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h2>17. Contact Information</h2>
              <p>
                If you have questions, requests, or complaints regarding this
                Privacy Policy, please contact:
              </p>
              <address>
                Elenxia EdTech Pvt. Ltd.
                <br />
                Astra Towers, Newtown, West Bengal
                <br />
                Email:{" "}
                <a href="mailto:support@elenxia.com">support@elenxia.com</a>
              </address>
            </div>

            <div className={styles.termsAcceptance}>
              <p>
                By using our website, you hereby consent to our Terms and
                Conditions and agree to its terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
