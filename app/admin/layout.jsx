"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChartLine,
  FaUsers,
  FaBookOpen,
  FaCertificate,
  FaBars,
  FaTimes,
  FaSearch,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import styles from "./css/admin.module.css";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname.startsWith(path);
  };

  const handleClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <button className={styles.menuButton} onClick={handleClick}>
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
        <h1 className={styles.mobileTitle}>Admin Dashboard</h1>
        <div className={styles.mobileIcons}>
          <FaBell className={styles.icon} />
          <FaUserCircle className={styles.icon} />
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <button className={styles.CloseIcons} onClick={handleClick}>
          {" "}
          <ImCancelCircle />
        </button>

        <div className={styles.sidebarHeader}>
          <Link href="/admin">
            <h2>LMS Admin</h2>
          </Link>
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            <li className={isActive("/admin") ? styles.active : ""}>
              <Link
                href="/admin"
                className={styles.navLink}
                onClick={() => setSidebarOpen(false)}
              >
                <FaChartLine className={styles.navIcon} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive("/admin/users") ? styles.active : ""}>
              <Link
                href="/admin/users"
                className={styles.navLink}
                onClick={() => setSidebarOpen(false)}
              >
                <FaUsers className={styles.navIcon} />
                <span>Users</span>
              </Link>
            </li>
            <li className={isActive("/admin/courses") ? styles.active : ""}>
              <Link
                href="/admin/courses"
                className={styles.navLink}
                onClick={() => setSidebarOpen(false)}
              >
                <FaBookOpen className={styles.navIcon} />
                <span>Courses</span>
              </Link>
            </li>
            <li
              className={isActive("/admin/certificates") ? styles.active : ""}
            >
              <Link
                href="/admin/certificates"
                className={styles.navLink}
                onClick={() => setSidebarOpen(false)}
              >
                <FaCertificate className={styles.navIcon} />
                <span>Certificates</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.searchBar}></div>
          <div className={styles.topBarActions}>
            <div className={styles.userProfile}>
              <FaUserCircle className={styles.profileIcon} />
              <span>Admin</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className={styles.pageContent}>{children}</div>
      </main>
    </div>
  );
}
