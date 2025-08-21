"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import {
  FaMoon,
  FaSun,
  FaBook,
  FaHome,
  FaCertificate,
  FaUserGraduate,
  FaSignOutAlt,
  FaPlay,
  FaCheckCircle,
  FaLock,
  FaDownload,
  FaSpinner,
} from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { FiMenu, FiX } from "react-icons/fi";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const playerRefs = useRef({});
  const intervalRefs = useRef({});
  const router = useRouter();

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from localStorage
      const token = localStorage.getItem("lms_token");
      if (!token) {
        console.log("No token found, redirecting to login");
        return;
      }

      const res = await fetch("/api/dashboard", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (res.status === 401) {
        console.log("Token expired or invalid, redirecting to login");
        localStorage.removeItem("lms_token");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch dashboard data: ${res.status}`);
      }

      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message);
      
      // If it's an authentication error, redirect to login
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        localStorage.removeItem("lms_token");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  const handleLogout = () => {
    localStorage.removeItem("lms_token");
    router.push("/login");
  };

  // YouTube API functions remain the same...
  const loadYouTubeAPI = () =>
    new Promise((resolve) => {
      if (window.YT && window.YT.Player) return resolve();
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = () => resolve();
      document.body.appendChild(tag);
    });

  const getYouTubeId = (url) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const initPlayers = async () => {
    if (!dashboardData?.courses) return;
    await loadYouTubeAPI();

    dashboardData.courses.forEach((course) => {
      course.videos.forEach((video) => {
        // Only initialize player if video is not locked
        if (video.locked) return;
        
        const videoId = getYouTubeId(video.url);
        if (!videoId) return;

        if (!playerRefs.current[video.id]) {
          playerRefs.current[video.id] = new window.YT.Player(
            `video-${video.id}`,
            {
              videoId,
              playerVars: {
                'modestbranding': 1,
                'showinfo': 0,
                'rel': 0,
                'fs': 0,
                'controls': 1,
                'disablekb': 1,
                'iv_load_policy': 3,
                'playsinline': 1,
              },
              events: {
                onReady: (event) => {
                  const duration = event.target.getDuration();
                  updateVideoDuration(course.id, video.id, duration);
                  hideShareButton(event.target);
                },
                onStateChange: (event) =>
                  handleVideoStateChange(course.id, video.id, event),
              },
            }
          );
        }
      });
    });
  };

  const hideShareButton = (player) => {
    try {
      const iframe = document.getElementById(player.getIframe().id);
      if (iframe) {
        const style = document.createElement('style');
        style.textContent = `
          .ytp-share-button { display: none !important; }
          .ytp-share-icon { display: none !important; }
          [aria-label="Share"] { display: none !important; }
        `;
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.head.appendChild(style);
        
        setTimeout(() => {
          try {
            const shareButton = iframeDoc.querySelector('.ytp-share-button');
            if (shareButton) shareButton.style.display = 'none';
            
            const shareIcon = iframeDoc.querySelector('.ytp-share-icon');
            if (shareIcon) shareIcon.style.display = 'none';
            
            const shareElements = iframeDoc.querySelectorAll('[aria-label="Share"]');
            shareElements.forEach(el => el.style.display = 'none');
          } catch (e) {
            console.log("Could not directly manipulate iframe elements");
          }
        }, 1000);
      }
    } catch (error) {
      console.log("Could not access iframe due to security restrictions");
      const iframe = document.getElementById(player.getIframe().id);
      if (iframe) {
        iframe.addEventListener('load', () => {
          const overlay = document.createElement('div');
          overlay.style.position = 'absolute';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100%';
          overlay.style.height = '100%';
          overlay.style.zIndex = '10';
          overlay.style.pointerEvents = 'none';
          
          iframe.parentNode.style.position = 'relative';
          iframe.parentNode.appendChild(overlay);
        });
      }
    }
  };

  const updateVideoDuration = (courseId, videoId, duration) => {
    setDashboardData((prev) => {
      const newCourses = prev.courses.map((course) => {
        if (course.id !== courseId) return course;

        const newVideos = course.videos.map((v) => {
          if (v.id === videoId) {
            return {
              ...v,
              duration,
              formattedDuration: formatDuration(duration),
            };
          }
          return v;
        });

        return {
          ...course,
          videos: newVideos,
        };
      });

      return { ...prev, courses: newCourses };
    });
  };

  const handleVideoStateChange = (courseId, videoId, event) => {
    const player = playerRefs.current[videoId];
    if (!player) return;

    if (intervalRefs.current[videoId])
      clearInterval(intervalRefs.current[videoId]);

    if (event.data === window.YT.PlayerState.PLAYING) {
      intervalRefs.current[videoId] = setInterval(() => {
        const duration = player.getDuration();
        const currentTime = player.getCurrentTime();
        let progress = Math.floor((currentTime / duration) * 100);
        const completed =
          event.data === window.YT.PlayerState.ENDED || progress >= 95;

        if (completed) progress = 100;

        updateVideoProgress(courseId, videoId, progress, completed);

        if (completed) clearInterval(intervalRefs.current[videoId]);
      }, 1000);
    }

    if (event.data === window.YT.PlayerState.ENDED) {
      updateVideoProgress(courseId, videoId, 100, true);
    }
  };

  const updateVideoProgress = (courseId, videoId, progress, completed) => {
    setDashboardData((prev) => {
      const newCourses = prev.courses.map((course) => {
        if (course.id !== courseId) return course;

        const newVideos = course.videos.map((v, index) => {
          if (v.id === videoId) {
            return { ...v, progress, completed };
          }
          
          if (completed && index > 0 && course.videos[index - 1].id === videoId) {
            return { ...v, locked: false };
          }
          
          return v;
        });

        const completedVideos = newVideos.filter((v) => v.completed).length;
        const courseCompleted = completedVideos === newVideos.length;

        return {
          ...course,
          videos: newVideos,
          progress: {
            videosWatched: completedVideos,
            completed: courseCompleted,
            completionPercentage: courseCompleted
              ? 100
              : Math.round((completedVideos / newVideos.length) * 100),
          },
        };
      });

      return { ...prev, courses: newCourses };
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (dashboardData) initPlayers();
  }, [dashboardData]);

  if (loading)
    return (
      <div
        className={`${styles.loadingContainer} ${
          darkMode ? styles.darkMode : ""
        }`}
      >
        <FaSpinner className={styles.spinner} />
        <p>Loading your dashboard...</p>
      </div>
    );

  if (error)
    return (
      <div
        className={`${styles.errorContainer} ${
          darkMode ? styles.darkMode : ""
        }`}
      >
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className={styles.retryBtn}>
          Try Again
        </button>
        <button onClick={() => router.push("/login")} className={styles.loginBtn}>
          Go to Login
        </button>
      </div>
    );

  return (
    <div
      className={`${styles.dashboardWrapper} ${
        darkMode ? styles.darkMode : ""
      }`}
    >
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <button className={styles.menuToggle} onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <ImCancelCircle size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          mobileMenuOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.userAvatar}>
            <FaUserGraduate size={32} />
          </div>
          <div className={styles.userInfo}>
            <h3>{dashboardData?.user?.name}</h3>
            <p>Student</p>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className={styles.cancelBtn} onClick={toggleMobileMenu}>
            <ImCancelCircle />
          </div>
        )}
        <nav className={styles.sidebarNav}>
          <div
            className={styles.menuItem}
            onClick={() => {
              window.scrollTo(0, 0);
              setMobileMenuOpen(false);
            }}
          >
            <FaHome className={styles.menuIcon} />
            <span>Dashboard</span>
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              const coursesSection = document.querySelector(`.${styles.coursesSection}`);
              if (coursesSection) {
                window.scrollTo(0, coursesSection.offsetTop - 20);
              }
              setMobileMenuOpen(false);
            }}
          >
            <FaBook className={styles.menuIcon} />
            <span>My Courses</span>
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              const certificatesSection = document.querySelector(`.${styles.certificatesSection}`);
              if (certificatesSection) {
                window.scrollTo(0, certificatesSection.offsetTop - 20);
              }
              setMobileMenuOpen(false);
            }}
          >
            <FaCertificate className={styles.menuIcon} />
            <span>Certificates</span>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.menuItem} onClick={toggleDarkMode}>
            {darkMode ? (
              <FaSun className={styles.menuIcon} />
            ) : (
              <FaMoon className={styles.menuIcon} />
            )}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FaSignOutAlt className={styles.menuIcon} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentHeader}>
          <h1>Welcome back, {dashboardData?.user?.name?.split(" ")[0]}!</h1>
          <p>Continue your learning journey</p>
        </div>

        <section className={styles.coursesSection}>
          <h2 className={styles.sectionTitle}>
            <FaBook className={styles.sectionIcon} />
            Your Courses
          </h2>

          {dashboardData?.courses?.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No approved courses available.</p>
              <button className={styles.primaryBtn}>Browse Courses</button>
            </div>
          ) : (
            <div className={styles.coursesGrid}>
              {dashboardData?.courses?.map((course) => (
                <div key={course.id} className={styles.courseCard}>
                  <div className={styles.courseHeader}>
                    <h3>{course.title}</h3>
                    <div className={styles.courseProgress}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${course.progress.completionPercentage}%`,
                          }}
                        />
                      </div>
                      <span>
                        {course.progress.completionPercentage}% Complete
                      </span>
                    </div>
                  </div>

                  <div className={styles.videosList}>
                    {course.videos.map((video) => (
                      <div key={video.id} className={styles.videoCard}>
                        <div className={styles.videoHeader}>
                          <h4>
                            {video.completed ? (
                              <FaCheckCircle
                                className={styles.videoCompletedIcon}
                              />
                            ) : video.locked ? (
                              <FaLock className={styles.videoLockedIcon} />
                            ) : (
                              <FaPlay className={styles.videoPlayIcon} />
                            )}
                            {video.title}
                            {video.locked && <span className={styles.lockedBadge}>Locked</span>}
                          </h4>
                          <span className={styles.videoDuration}>
                            {video.formattedDuration}
                          </span>
                        </div>

                        {video.locked ? (
                          <div className={styles.lockedOverlay}>
                            <FaLock size={32} />
                            <p>Complete the previous video to unlock this content</p>
                          </div>
                        ) : (
                          <>
                            <div className={styles.videoContainer}>
                              <div
                                id={`video-${video.id}`}
                                className={styles.videoPlayer}
                              />
                            </div>

                            <div className={styles.videoProgress}>
                              <div className={styles.progressBar}>
                                <div
                                  className={styles.progressFill}
                                  style={{ width: `${video.progress}%` }}
                                />
                              </div>
                              <span>{video.progress}% Watched</span>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className={styles.courseFooter}>
                    <button
                      className={`${styles.certificateBtn} ${
                        !course.progress.completed || !course.certificateUrl
                          ? styles.disabled
                          : ""
                      }`}
                      disabled={
                        !course.progress.completed || !course.certificateUrl
                      }
                      onClick={() =>
                        course.progress.completed &&
                        course.certificateUrl &&
                        window.open(course.certificateUrl)
                      }
                    >
                      {course.progress.completed && course.certificateUrl ? (
                        <>
                          <FaDownload /> Download Certificate
                        </>
                      ) : (
                        <>
                          <FaLock /> Certificate Locked
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {dashboardData?.courses?.some(
          (c) => c.progress.completed && c.certificateUrl
        ) && (
          <section className={styles.certificatesSection}>
            <h2 className={styles.sectionTitle}>
              <FaCertificate className={styles.sectionIcon} />
              Your Certificates
            </h2>
            <div className={styles.certificatesGrid}>
              {dashboardData.courses
                .filter(
                  (course) => course.progress.completed && course.certificateUrl
                )
                .map((course) => (
                  <div key={course.id} className={styles.certificateCard}>
                    <div className={styles.certificatePreview}>
                      <FaCertificate size={48} />
                    </div>
                    <div className={styles.certificateInfo}>
                      <h3>{course.title}</h3>
                      <p>Completed on {new Date().toLocaleDateString()}</p>
                    </div>
                    <button
                      className={styles.downloadBtn}
                      onClick={() => window.open(course.certificateUrl)}
                    >
                      <FaDownload /> Download
                    </button>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}