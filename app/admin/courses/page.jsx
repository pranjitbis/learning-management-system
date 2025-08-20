'use client';
import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiX, FiEdit, FiVideo, FiDollarSign, FiType } from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import styles from "./courses.module.css";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState({ fetch: false, delete: false, add: false });
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, courseId: null, courseTitle: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: 0,
    category: "web-dev",
    thumbnail: null,
    videos: []
  });

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    setIsLoading(prev => ({ ...prev, fetch: true }));
    setError(null);
    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch("/api/courses", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(prev => ({ ...prev, fetch: false }));
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.title || !newCourse.description || newCourse.videos.length === 0) {
      alert("Please fill all fields and add at least one video!");
      return;
    }

    setIsLoading(prev => ({ ...prev, add: true }));
    try {
      const token = localStorage.getItem("lms_token");

      const videosForBackend = newCourse.videos.map(v => ({
        title: v.title,
        url: v.youtubeUrl
      }));

      const courseData = { ...newCourse, videos: videosForBackend };

      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(courseData)
      });
      if (!res.ok) throw new Error("Failed to add course");
      const data = await res.json();
      setCourses(prev => [data, ...prev]);
      setNewCourse({ title: "", description: "", price: 0, category: "web-dev", thumbnail: null, videos: [] });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(prev => ({ ...prev, add: false }));
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.courseId) return;
    setIsLoading(prev => ({ ...prev, delete: true }));
    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch(`/api/courses?id=${deleteModal.courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete course");
      await fetchCourses();
      setDeleteModal({ open: false, courseId: null, courseTitle: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const addVideo = () => {
    setNewCourse(prev => ({ ...prev, videos: [...prev.videos, { title: "", youtubeUrl: "" }] }));
  };

  const updateVideo = (index, field, value) => {
    const updatedVideos = [...newCourse.videos];
    updatedVideos[index][field] = value;
    setNewCourse(prev => ({ ...prev, videos: updatedVideos }));
  };

  const removeVideo = (index) => {
    const updatedVideos = [...newCourse.videos];
    updatedVideos.splice(index, 1);
    setNewCourse(prev => ({ ...prev, videos: updatedVideos }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Course Management</h1>
        <div className={styles.actions}>
          <button 
            className={`${styles.button} ${showAddForm ? styles.secondary : styles.primary}`}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? (
              <>
                <FiX size={16} /> Close Form
              </>
            ) : (
              <>
                <FiPlus size={16} /> Add Course
              </>
            )}
          </button>
        </div>
      </header>

      {error && (
        <div className={styles.alertError}>
          <p>{error}</p>
        </div>
      )}

      {showAddForm && (
        <div className={styles.addForm}>
          <h2 className={styles.formTitle}>Add New Course</h2>
          
          <div className={styles.formGroup}>
            <label>
              <FiType size={16} /> Course Title
            </label>
            <input 
              type="text" 
              placeholder="Enter course title" 
              value={newCourse.title} 
              onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} 
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea 
              placeholder="Enter course description" 
              value={newCourse.description} 
              onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} 
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                <FiDollarSign size={16} /> Price
              </label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={newCourse.price} 
                onChange={e => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) })} 
              />
            </div>

            <div className={styles.formGroup}>
              <label>Category</label>
              <select 
                value={newCourse.category} 
                onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
              >
                <option value="web-dev">Web Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
          </div>

          <div className={styles.videosSection}>
            <h3 className={styles.sectionTitle}>
              <FiVideo size={18} /> Course Videos
            </h3>
            
            {newCourse.videos.map((video, idx) => (
              <div key={idx} className={styles.videoRow}>
                <div className={styles.videoInputs}>
                  <input 
                    type="text" 
                    placeholder="Video Title" 
                    value={video.title} 
                    onChange={e => updateVideo(idx, "title", e.target.value)} 
                  />
                  <div className={styles.youtubeInput}>
                    <FaYoutube size={18} className={styles.youtubeIcon} />
                    <input 
                      type="text" 
                      placeholder="YouTube URL" 
                      value={video.youtubeUrl} 
                      onChange={e => updateVideo(idx, "youtubeUrl", e.target.value)} 
                    />
                  </div>
                </div>
                <button 
                  className={styles.removeVideoBtn}
                  onClick={() => removeVideo(idx)}
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
            
            <button 
              className={styles.addVideoBtn}
              onClick={addVideo}
            >
              <FiPlus size={16} /> Add Video
            </button>
          </div>

          <button 
            className={styles.submitButton}
            onClick={handleAddCourse} 
            disabled={isLoading.add}
          >
            {isLoading.add ? "Adding Course..." : "Add Course"}
          </button>
        </div>
      )}

      <div className={styles.courseGrid}>
        {isLoading.fetch ? (
          <div className={styles.loading}>
            <p>Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No courses found. Add your first course!</p>
          </div>
        ) : (
          courses.map(course => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.cardHeader}>
                <h3>{course.title}</h3>
                <span className={`${styles.category} ${styles[course.category]}`}>
                  {course.category}
                </span>
              </div>
              <p className={styles.cardDescription}>{course.description}</p>
              <div className={styles.cardFooter}>
                <div className={styles.price}>
                  <FiDollarSign size={14} /> {course.price.toFixed(2)}
                </div>
                <div className={styles.videoCount}>
                  <FiVideo size={14} /> {course.videos?.length || 0}
                </div>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => setDeleteModal({ open: true, courseId: course.id, courseTitle: course.title })}
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete <strong>"{deleteModal.courseTitle}"</strong>? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setDeleteModal({ ...deleteModal, open: false })}
              >
                Cancel
              </button>
              <button 
                className={styles.deleteConfirmBtn}
                onClick={handleDelete}
                disabled={isLoading.delete}
              >
                {isLoading.delete ? "Deleting..." : "Delete Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}