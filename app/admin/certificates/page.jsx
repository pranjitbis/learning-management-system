"use client";

import { useEffect, useState } from "react";
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

  const getUserCertificates = (userId) =>
    certificates.filter((c) => c.userId === userId);

  const getAvailableCourses = (userId) => {
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
                      disabled={getAvailableCourses(user.id).length === 0}
                    >
                      <FaFileUpload /> Assign
                    </button>
                  </td>
                  <td className={styles.certificatesCell}>
                    {userCertificates.length > 0 ? (
                      <ul className={styles.certificateList}>
                        {userCertificates.map((cert) => (
                          <li key={cert.id} className={styles.certificateItem}>
                            <div className={styles.certificateInfo}>
                              <span className={styles.courseTitle}>
                                {cert.course?.title || "Course Deleted"}
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
                                  Are you sure you want to delete "{user.name}"?
                                  This action cannot be undone.
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
                              <button className={styles.confrom} onClick={() => clickData()}>
                                Delete
                              </button>
                            )}
                          </li>
                        ))}
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
