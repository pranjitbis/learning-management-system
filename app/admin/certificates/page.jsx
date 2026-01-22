"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./certificates.module.css";
import {
  FaFileUpload,
  FaTrash,
  FaCheck,
  FaTimes,
  FaCertificate,
} from "react-icons/fa";

export default function AdminCertificatesPage() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);

  const clickData = () => {
    setShow(!show);
  };

  const router = useRouter();

  const handleUnauthorized = () => {
    router.push("/unauthorized");
    return;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchUsers(), fetchCourses(), fetchCertificates()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        // Handle different response formats
        const usersArray = Array.isArray(data)
          ? data
          : data?.data
            ? data.data
            : data?.users
              ? data.users
              : [];
        setUsers(usersArray || []);
      } else if (res.status === 401) {
        handleUnauthorized();
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        console.log("Courses API response:", data); // Debug log

        // Handle different response formats
        let coursesArray = [];
        if (Array.isArray(data)) {
          coursesArray = data;
        } else if (data && Array.isArray(data.data)) {
          coursesArray = data.data;
        } else if (data && Array.isArray(data.courses)) {
          coursesArray = data.courses;
        } else if (data && data.success && Array.isArray(data.data)) {
          coursesArray = data.data;
        } else if (data && data.courses) {
          // Try to convert to array if it's an object
          coursesArray = Object.values(data.courses);
        }

        setCourses(coursesArray || []);
      } else if (res.status === 401) {
        handleUnauthorized();
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]); // Ensure it's always an array
    }
  };

  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/certificates");
      if (res.ok) {
        const data = await res.json();
        // Handle different response formats
        const certsArray = Array.isArray(data)
          ? data
          : data?.data
            ? data.data
            : data?.certificates
              ? data.certificates
              : [];
        setCertificates(certsArray || []);
      } else if (res.status === 401) {
        handleUnauthorized();
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  const openForm = (user) => {
    setSelectedUser(user);
    setShowForm(true);
    setUploadStatus(null);
    setSelectedCourse("");
    setCertificateFile(null);
  };

  const handleUpload = async () => {
    if (!selectedUser || !selectedCourse || !certificateFile) {
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("userId", selectedUser.id);
      formData.append("courseId", selectedCourse);
      formData.append("certificate", certificateFile);

      const res = await fetch("/api/certificates", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setUploadStatus("success");
      setCertificates((prev) => [...prev, data]);
      setTimeout(() => setShowForm(false), 1500);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");
    }
  };

  const handleDelete = async (certificateId) => {
    try {
      const res = await fetch(`/api/certificates/${certificateId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setCertificates(certificates.filter((c) => c.id !== certificateId));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete certificate.");
    }
  };

  const getUserCertificates = (userId) => {
    if (!Array.isArray(certificates)) return [];
    return certificates.filter((c) => c.userId === userId);
  };

  const getAvailableCourses = (userId) => {
    if (!Array.isArray(courses)) return [];
    const userCerts = getUserCertificates(userId).map((c) => c.courseId);
    return courses.filter((c) => !userCerts.includes(c.id));
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading certificate data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <FaCertificate className={styles.titleIcon} />
          Certificate Management
        </h1>
        <p className={styles.subtitle}>
          Manage and assign certificates to users
        </p>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
              <th>Certificates</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const userCertificates = getUserCertificates(user.id);
              const availableCourses = getAvailableCourses(user.id);

              return (
                <tr key={user.id}>
                  <td className={styles.idCell}>{user.id}</td>
                  <td className={styles.nameCell}>{user.name}</td>
                  <td className={styles.emailCell}>{user.email}</td>
                  <td className={styles.roleCell}>
                    <span
                      className={`${styles.roleBadge} ${
                        user.role === "admin" ? styles.adminBadge : ""
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.createBtn}
                      onClick={() => openForm(user)}
                      disabled={availableCourses.length === 0}
                    >
                      <FaFileUpload /> Assign
                    </button>
                  </td>
                  <td className={styles.certificatesCell}>
                    {userCertificates.length > 0 ? (
                      <ul className={styles.certificateList}>
                        {userCertificates.map((cert) => {
                          // Find course name for this certificate
                          const course = Array.isArray(courses)
                            ? courses.find((c) => c.id === cert.courseId)
                            : null;

                          return (
                            <li
                              key={cert.id}
                              className={styles.certificateItem}
                            >
                              <div className={styles.certificateInfo}>
                                <span className={styles.courseTitle}>
                                  {course?.title ||
                                    cert.course?.title ||
                                    `Course ID: ${cert.courseId}`}
                                </span>
                                <span
                                  className={`${styles.statusBadge} ${
                                    cert.approved
                                      ? styles.approved
                                      : styles.pending
                                  }`}
                                >
                                  {cert.approved ? <FaCheck /> : <FaTimes />}
                                  {cert.approved ? "Approved" : "Pending"}
                                </span>
                              </div>
                              {show ? (
                                <div className={styles.delete}>
                                  <h3>Confirm Deletion</h3>
                                  <p>
                                    Are you sure you want to delete "{user.name}
                                    "? This action cannot be undone.
                                  </p>
                                  <div className={styles.confirmMessage}>
                                    <button onClick={clickData}>Close</button>
                                    <button
                                      id={styles.colors}
                                      className={styles.deleteBtn}
                                      onClick={() => handleDelete(cert.id)}
                                      title="Delete certificate"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  className={styles.confrom}
                                  onClick={() => clickData()}
                                >
                                  Delete
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <span className={styles.noCertificates}>
                        No certificates
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showForm && selectedUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.uploadForm}>
            <h3 className={styles.formTitle}>
              Assign Certificate to {selectedUser.name}
            </h3>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Select Course</label>
              <select
                className={styles.formSelect}
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">-- Select a course --</option>
                {getAvailableCourses(selectedUser.id).map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Certificate File</label>
              <div className={styles.fileInputContainer}>
                <input
                  type="file"
                  id="certificateFile"
                  className={styles.fileInput}
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => setCertificateFile(e.target.files[0])}
                />
                <label
                  htmlFor="certificateFile"
                  className={styles.fileInputLabel}
                >
                  {certificateFile ? certificateFile.name : "Choose file..."}
                </label>
              </div>
              <p className={styles.fileHint}>PDF, JPG, or PNG files only</p>
            </div>

            <div className={styles.formActions}>
              <button
                className={styles.uploadBtn}
                onClick={handleUpload}
                disabled={uploadStatus === "uploading"}
              >
                {uploadStatus === "uploading" ? (
                  <span className={styles.spinner}></span>
                ) : (
                  <FaFileUpload />
                )}
                {uploadStatus === "uploading"
                  ? "Uploading..."
                  : "Upload Certificate"}
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowForm(false)}
                disabled={uploadStatus === "uploading"}
              >
                Cancel
              </button>
            </div>

            {uploadStatus === "success" && (
              <div className={styles.alertSuccess}>
                <FaCheck /> Certificate uploaded successfully!
              </div>
            )}
            {uploadStatus === "error" && (
              <div className={styles.alertError}>
                <FaTimes /> Failed to upload certificate. Please try again.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
