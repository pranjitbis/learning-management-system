"use client";

import { useState, useEffect } from "react";
import {
  FaBookOpen,
  FaCertificate,
  FaUsers,
  FaChartLine,
  FaGraduationCap,
  FaVideo,
  FaDollarSign,
  FaEllipsisH,
  FaSearch,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import styles from "./css/dashboard.module.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    fetchUsers();
    fetchCourses();
    fetchCertificates();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
  };

  const fetchCourses = async () => {
    const res = await fetch("/api/courses");
    if (res.ok) setCourses(await res.json());
  };

  const fetchCertificates = async () => {
    const res = await fetch("/api/certificates");
    if (res.ok) setCertificates(await res.json());
  };

  const totalCertificates = certificates.filter((c) => c.approved).length;
  const pendingCertificates = certificates.filter((c) => !c.approved).length;

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Header */}

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Dashboard Content */}
        <div className={styles.dashboardContent}>
          <h2 className={styles.contentTitle}>Dashboard Overview</h2>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.statCard1}`}>
              <div className={styles.statIcon}>
                <FaUsers size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>{users.length}</h3>
                <p>Total Users</p>
                <span className={styles.statTrend}>+12% from last month</span>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.statCard2}`}>
              <div className={styles.statIcon}>
                <FaBookOpen size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>{courses.length}</h3>
                <p>Total Courses</p>
                <span className={styles.statTrend}>+5 new this month</span>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.statCard3}`}>
              <div className={styles.statIcon}>
                <FaGraduationCap size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>{totalCertificates}</h3>
                <p>Certificates Issued</p>
                <span className={styles.statTrend}>+8% from last month</span>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.statCard4}`}>
              <div className={styles.statIcon}>
                <FaCertificate size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>{pendingCertificates}</h3>
                <p>Pending Approvals</p>
                <span className={styles.statTrend}>Action required</span>
              </div>
            </div>
          </div>

          {/* Recent Courses */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Recent Courses</h3>
              <button className={styles.viewAllBtn}>View All</button>
            </div>

            <div className={styles.coursesGrid}>
              {courses.slice(0, 4).map((course) => {
                const courseCertificates = certificates.filter(
                  (c) => c.courseId === course.id && c.approved
                );

                return (
                  <div key={course.id} className={styles.courseCard}>
                    {course.thumbnail && (
                      <img
                        src={`/uploads/${course.thumbnail}`}
                        alt={course.title}
                        className={styles.thumbnail}
                      />
                    )}
                    <div className={styles.courseInfo}>
                      <h4>{course.title}</h4>
                      <p className={styles.courseDesc}>
                        {course.description.substring(0, 60)}...
                      </p>
                      <div className={styles.courseMeta}>
                        <span>
                          <FaVideo /> {course.videos.length} videos
                        </span>
                        <span>
                          <FaDollarSign /> {course.price}
                        </span>
                        <span>
                          <FaGraduationCap /> {courseCertificates.length} certs
                        </span>
                      </div>
                    </div>
                    <button className={styles.courseMenu}>
                      <FaEllipsisH />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
