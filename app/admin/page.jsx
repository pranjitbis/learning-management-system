"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaBookOpen,
  FaCertificate,
  FaUsers,
  FaGraduationCap,
  FaVideo,
  FaDollarSign,
  FaEllipsisH,
} from "react-icons/fa";
import styles from "./css/dashboard.module.css";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState({
    users: true,
    courses: true,
    certificates: true,
  });

  useEffect(() => {
    fetchUsers();
    fetchCourses();
    fetchCertificates();
  }, []);

  const handleUnauthorized = () => {
    localStorage.removeItem("lms_token");
    router.push("/unauthorized");
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        // Handle different response formats
        const usersData = Array.isArray(data)
          ? data
          : data?.data
            ? data.data
            : data?.users
              ? data.users
              : [];
        setUsers(usersData);
      }
      if (res.status === 401) handleUnauthorized();
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        // Handle different response formats
        const coursesData = Array.isArray(data)
          ? data
          : data?.data
            ? data.data
            : data?.courses
              ? data.courses
              : [];
        setCourses(coursesData);
      }
      if (res.status === 401) handleUnauthorized();
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading((prev) => ({ ...prev, courses: false }));
    }
  };

  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/certificates", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        // Handle different response formats
        const certsData = Array.isArray(data)
          ? data
          : data?.data
            ? data.data
            : data?.certificates
              ? data.certificates
              : [];
        setCertificates(certsData);
      }
      if (res.status === 401) handleUnauthorized();
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading((prev) => ({ ...prev, certificates: false }));
    }
  };

  const totalCertificates = certificates.filter((c) => c.approved).length;
  const pendingCertificates = certificates.filter((c) => !c.approved).length;

  // Show loading state
  const isLoading = loading.users || loading.courses || loading.certificates;

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
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
                  (c) => c.courseId === course.id && c.approved,
                );

                return (
                  <div key={course.id} className={styles.courseCard}>
                    <div className={styles.courseInfo}>
                      <h4>{course.title || "Untitled Course"}</h4>
                      <p className={styles.courseDesc}>
                        {course.description
                          ? `${course.description.substring(0, 60)}...`
                          : "No description available"}
                      </p>
                      <div className={styles.courseMeta}>
                        <span>
                          <FaVideo /> {course.videos?.length || 0} videos
                        </span>
                        <span>
                          <FaDollarSign /> ${course.price || 0}
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
