// app/admin/courses/page.jsx
"use client";
import { useState, useEffect } from "react";
import {
  FiPlus,
  FiTrash2,
  FiX,
  FiEdit,
  FiVideo,
  FiDollarSign,
  FiType,
  FiSave,
} from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import styles from "./courses.module.css";
import { useRouter } from "next/navigation";

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState({
    fetch: false,
    delete: false,
    add: false,
    edit: false,
  });
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    courseId: null,
    courseTitle: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: 0,
    category: "web-dev",
    thumbnail: null,
    videos: [],
  });

  // Check authentication status
  const checkAuth = () => {
    if (typeof window === "undefined") return false;
    
    const token = localStorage.getItem("lms_token");
    if (!token) {
      handleUnauthorized();
      return false;
    }
    
    try {
      // Verify token structure (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        localStorage.removeItem("lms_token");
        handleUnauthorized();
        return false;
      }
      
      return true;
    } catch (error) {
      localStorage.removeItem("lms_token");
      handleUnauthorized();
      return false;
    }
  };

  useEffect(() => {
    if (checkAuth()) {
      fetchCourses();
    }
  }, []);

  const handleUnauthorized = () => {
    router.push("/unauthorized");
    return;
  };

  const fetchCourses = async () => {
    if (!checkAuth()) return;
    
    setIsLoading((prev) => ({ ...prev, fetch: true }));
    setError(null);
    try {
      const token = localStorage.getItem("lms_token");
      
      const res = await fetch("/api/courses", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (res.status === 401) {
        localStorage.removeItem("lms_token");
        return handleUnauthorized();
      }
      
      if (res.status === 403) {
        setError("You don't have permission to access this resource");
        return;
      }
      
      if (!res.ok) throw new Error("Failed to fetch courses");

      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, fetch: false }));
    }
  };

  const handleAddCourse = async () => {
    if (!checkAuth()) return;
    
    if (
      !newCourse.title ||
      !newCourse.description ||
      newCourse.videos.length === 0
    ) {
      setError("Please fill all fields and add at least one video!");
      return;
    }

    // Validate YouTube URLs
    const invalidVideos = newCourse.videos.filter(video => 
      !isValidYouTubeUrl(video.youtubeUrl)
    );
    
    if (invalidVideos.length > 0) {
      setError("Please enter valid YouTube URLs");
      return;
    }

    setIsLoading((prev) => ({ ...prev, add: true }));
    setError(null);
    
    try {
      const token = localStorage.getItem("lms_token");

      const videosForBackend = newCourse.videos.map((v) => ({
        title: v.title.trim(),
        url: extractYouTubeId(v.youtubeUrl),
      }));

      const courseData = { 
        ...newCourse, 
        videos: videosForBackend,
        price: parseFloat(newCourse.price) || 0
      };

      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(courseData),
      });
      
      if (res.status === 401) {
        localStorage.removeItem("lms_token");
        return handleUnauthorized();
      }
      
      if (res.status === 403) {
        setError("You don't have permission to create courses");
        return;
      }
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add course");
      }
      
      const data = await res.json();
      setCourses((prev) => [data, ...prev]);
      setNewCourse({
        title: "",
        description: "",
        price: 0,
        category: "web-dev",
        thumbnail: null,
        videos: [],
      });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, add: false }));
    }
  };

  const handleEditCourse = async () => {
    if (!checkAuth() || !editingCourse) return;
    
    if (
      !editingCourse.title ||
      !editingCourse.description ||
      editingCourse.videos.length === 0
    ) {
      setError("Please fill all fields and add at least one video!");
      return;
    }

    // Validate YouTube URLs
    const invalidVideos = editingCourse.videos.filter(video => 
      !isValidYouTubeUrl(video.youtubeUrl)
    );
    
    if (invalidVideos.length > 0) {
      setError("Please enter valid YouTube URLs");
      return;
    }

    setIsLoading((prev) => ({ ...prev, edit: true }));
    setError(null);
    
    try {
      const token = localStorage.getItem("lms_token");

      const videosForBackend = editingCourse.videos.map((v) => ({
        id: v.id || undefined, // Include ID for existing videos
        title: v.title.trim(),
        url: extractYouTubeId(v.youtubeUrl),
      }));

      const courseData = { 
        ...editingCourse, 
        videos: videosForBackend,
        price: parseFloat(editingCourse.price) || 0
      };

      const res = await fetch(`/api/courses?id=${editingCourse.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(courseData),
      });
      
      if (res.status === 401) {
        localStorage.removeItem("lms_token");
        return handleUnauthorized();
      }
      
      if (res.status === 403) {
        setError("You don't have permission to edit courses");
        return;
      }
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update course");
      }
      
      const data = await res.json();
      setCourses((prev) => 
        prev.map(course => course.id === data.id ? data : course)
      );
      setEditingCourse(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, edit: false }));
    }
  };

  const handleDelete = async () => {
    if (!checkAuth() || !deleteModal.courseId) return;
    
    setIsLoading((prev) => ({ ...prev, delete: true }));
    setError(null);
    
    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch(`/api/courses?id=${deleteModal.courseId}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      if (res.status === 401) {
        localStorage.removeItem("lms_token");
        return handleUnauthorized();
      }
      
      if (res.status === 403) {
        setError("You don't have permission to delete courses");
        return;
      }
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete course");
      }
      
      await fetchCourses();
      setDeleteModal({ open: false, courseId: null, courseTitle: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  // Start editing a course
  const startEditing = (course) => {
    // Convert video URLs to YouTube format for editing
    const videosWithYoutubeUrls = course.videos.map(video => ({
      ...video,
      youtubeUrl: convertToYoutubeUrl(video.url)
    }));
    
    setEditingCourse({
      ...course,
      videos: videosWithYoutubeUrls
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCourse(null);
  };

  // YouTube URL validation
  const isValidYouTubeUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return pattern.test(url);
  };

  // Extract YouTube ID from URL
  const extractYouTubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Convert embed URL to YouTube URL for editing
  const convertToYoutubeUrl = (url) => {
    if (url.includes('youtube.com/embed/')) {
      const videoId = url.split('embed/')[1];
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return url;
  };

  const addVideo = (isEditing = false) => {
    if (isEditing) {
      setEditingCourse((prev) => ({
        ...prev,
        videos: [...prev.videos, { title: "", youtubeUrl: "" }],
      }));
    } else {
      setNewCourse((prev) => ({
        ...prev,
        videos: [...prev.videos, { title: "", youtubeUrl: "" }],
      }));
    }
  };

  const updateVideo = (index, field, value, isEditing = false) => {
    if (isEditing) {
      const updatedVideos = [...editingCourse.videos];
      updatedVideos[index][field] = value;
      setEditingCourse((prev) => ({ ...prev, videos: updatedVideos }));
    } else {
      const updatedVideos = [...newCourse.videos];
      updatedVideos[index][field] = value;
      setNewCourse((prev) => ({ ...prev, videos: updatedVideos }));
    }
  };

  const removeVideo = (index, isEditing = false) => {
    if (isEditing) {
      const updatedVideos = [...editingCourse.videos];
      updatedVideos.splice(index, 1);
      setEditingCourse((prev) => ({ ...prev, videos: updatedVideos }));
    } else {
      const updatedVideos = [...newCourse.videos];
      updatedVideos.splice(index, 1);
      setNewCourse((prev) => ({ ...prev, videos: updatedVideos }));
    }
  };

  // Input sanitization
  const sanitizeInput = (input) => {
    return input.replace(/[<>]/g, '');
  };

  if (!checkAuth()) {
    return (
      <div className={styles.loading}>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Course Management</h1>
        <div className={styles.actions}>
          <button
            className={`${styles.button} ${
              showAddForm ? styles.secondary : styles.primary
            }`}
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={!!editingCourse}
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
          <button onClick={() => setError(null)} className={styles.closeError}>
            <FiX size={16} />
          </button>
        </div>
      )}

      {showAddForm && (
        <div className={styles.addForm}>
          <h2 className={styles.formTitle}>Add New Course</h2>

          <div className={styles.formGroup}>
            <label>
              <FiType size={16} /> Course Title *
            </label>
            <input
              type="text"
              placeholder="Enter course title"
              value={newCourse.title}
              onChange={(e) =>
                setNewCourse({ ...newCourse, title: sanitizeInput(e.target.value) })
              }
              maxLength={100}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description *</label>
            <textarea
              placeholder="Enter course description"
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: sanitizeInput(e.target.value) })
              }
              maxLength={500}
              required
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
                min="0"
                step="0.01"
                value={newCourse.price}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    price: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Category</label>
              <select
                value={newCourse.category}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, category: e.target.value })
                }
              >
                <option value="web-dev">Web Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="business">Business</option>
                <option value="photography">Photography</option>
              </select>
            </div>
          </div>

          <div className={styles.videosSection}>
            <h3 className={styles.sectionTitle}>
              <FiVideo size={18} /> Course Videos *
            </h3>

            {newCourse.videos.map((video, idx) => (
              <div key={idx} className={styles.videoRow}>
                <div className={styles.videoInputs}>
                  <input
                    type="text"
                    placeholder="Video Title *"
                    value={video.title}
                    onChange={(e) => updateVideo(idx, "title", sanitizeInput(e.target.value))}
                    required
                  />
                  <div className={styles.youtubeInput}>
                    <FaYoutube size={18} className={styles.youtubeIcon} />
                    <input
                      type="url"
                      placeholder="YouTube URL *"
                      value={video.youtubeUrl}
                      onChange={(e) =>
                        updateVideo(idx, "youtubeUrl", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <button
                  className={styles.removeVideoBtn}
                  onClick={() => removeVideo(idx)}
                  type="button"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}

            <button 
              className={styles.addVideoBtn} 
              onClick={() => addVideo(false)}
              type="button"
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

      {editingCourse && (
        <div className={styles.addForm}>
          <h2 className={styles.formTitle}>Edit Course</h2>

          <div className={styles.formGroup}>
            <label>
              <FiType size={16} /> Course Title *
            </label>
            <input
              type="text"
              placeholder="Enter course title"
              value={editingCourse.title}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, title: sanitizeInput(e.target.value) })
              }
              maxLength={100}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description *</label>
            <textarea
              placeholder="Enter course description"
              value={editingCourse.description}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, description: sanitizeInput(e.target.value) })
              }
              maxLength={500}
              required
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
                min="0"
                step="0.01"
                value={editingCourse.price}
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    price: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Category</label>
              <select
                value={editingCourse.category}
                onChange={(e) =>
                  setEditingCourse({ ...editingCourse, category: e.target.value })
                }
              >
                <option value="web-dev">Web Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="business">Business</option>
                <option value="photography">Photography</option>
              </select>
            </div>
          </div>

          <div className={styles.videosSection}>
            <h3 className={styles.sectionTitle}>
              <FiVideo size={18} /> Course Videos *
            </h3>

            {editingCourse.videos.map((video, idx) => (
              <div key={idx} className={styles.videoRow}>
                <div className={styles.videoInputs}>
                  <input
                    type="text"
                    placeholder="Video Title *"
                    value={video.title}
                    onChange={(e) => updateVideo(idx, "title", sanitizeInput(e.target.value), true)}
                    required
                  />
                  <div className={styles.youtubeInput}>
                    <FaYoutube size={18} className={styles.youtubeIcon} />
                    <input
                      type="url"
                      placeholder="YouTube URL *"
                      value={video.youtubeUrl}
                      onChange={(e) =>
                        updateVideo(idx, "youtubeUrl", e.target.value, true)
                      }
                      required
                    />
                  </div>
                </div>
                <button
                  className={styles.removeVideoBtn}
                  onClick={() => removeVideo(idx, true)}
                  type="button"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}

            <button 
              className={styles.addVideoBtn} 
              onClick={() => addVideo(true)}
              type="button"
            >
              <FiPlus size={16} /> Add Video
            </button>
          </div>

          <div className={styles.editActions}>
            <button
              className={styles.cancelButton}
              onClick={cancelEditing}
              disabled={isLoading.edit}
            >
              <FiX size={16} /> Cancel
            </button>
            <button
              className={styles.submitButton}
              onClick={handleEditCourse}
              disabled={isLoading.edit}
            >
              {isLoading.edit ? "Saving..." : <><FiSave size={16} /> Save Changes</>}
            </button>
          </div>
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
          courses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.cardHeader}>
                <h3>{course.title}</h3>
                <span
                  className={`${styles.category} ${styles[course.category]}`}
                >
                  {course.category}
                </span>
              </div>
              <p className={styles.cardDescription}>
                {course.description.length > 100 
                  ? `${course.description.substring(0, 100)}...` 
                  : course.description
                }
              </p>
              <div className={styles.cardFooter}>
                <div className={styles.price}>
                  <FiDollarSign size={14} /> {course.price.toFixed(2)}
                </div>
                <div className={styles.videoCount}>
                  <FiVideo size={14} /> {course.videos?.length || 0} videos
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => startEditing(course)}
                    disabled={!!editingCourse || isLoading.delete}
                  >
                    <FiEdit size={14} />
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      setDeleteModal({
                        open: true,
                        courseId: course.id,
                        courseTitle: course.title,
                      })
                    }
                    disabled={isLoading.delete || !!editingCourse}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>"{deleteModal.courseTitle}"</strong>? This action cannot
              be undone.
            </p>
            {error && <p className={styles.modalError}>{error}</p>}
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setDeleteModal({ ...deleteModal, open: false });
                  setError(null);
                }}
                disabled={isLoading.delete}
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