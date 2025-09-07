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

  // Check if user is authenticated
  const isAuthenticated = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("lms_token");
      return !!token;
    }
    return false;
  };

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      router.push("/login?from=/dashboard");
      return;
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from localStorage
      const token = localStorage.getItem("lms_token");
      if (!token) {
        console.log("No token found, redirecting to login");
        router.push("/login?from=/dashboard");
        return;
      }

      const res = await fetch("/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        console.log("Token expired or invalid, redirecting to login");
        localStorage.removeItem("lms_token");
        router.push("/login?from=/dashboard");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to fetch dashboard data: ${res.status}`
        );
      }

      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message);

      // If it's an authentication error, redirect to login
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        localStorage.removeItem("lms_token");
        router.push("/login?from=/dashboard");
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

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Improved YouTube ID extraction
  const getYouTubeId = (url) => {
    if (!url) return null;

    // Handle embed URLs
    if (url.includes("youtube.com/embed/")) {
      return url.split("youtube.com/embed/")[1].split("?")[0];
    }

    // Handle watch URLs
    if (url.includes("youtube.com/watch?v=")) {
      return url.split("v=")[1].split("&")[0];
    }

    // Handle youtu.be URLs
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split("?")[0];
    }

    // Handle already extracted IDs
    if (url.length === 11 && !url.includes("/") && !url.includes("?")) {
      return url;
    }

    return null;
  };

  // Improved YouTube API loading
  const loadYouTubeAPI = () => {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }

      // Check if script is already loading
      if (
        document.querySelector(
          'script[src="https://www.youtube.com/iframe_api"]'
        )
      ) {
        const checkInterval = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        return;
      }

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.onload = () => {
        // YouTube API doesn't fire onload, so we need to check for YT
        const checkYT = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkYT);
            resolve();
          }
        }, 100);
      };
      document.body.appendChild(tag);
    });
  };

  const initPlayers = async () => {
    if (!dashboardData?.courses) return;

    try {
      await loadYouTubeAPI();

      dashboardData.courses.forEach((course) => {
        course.videos.forEach((video) => {
          if (video.locked) return;

          const videoId = getYouTubeId(video.url);
          if (!videoId) return;

          // ⛔ Prevent blinking – do NOT destroy if already exists
          if (playerRefs.current[video.id]) {
            return;
          }

          // Create new player only once
          playerRefs.current[video.id] = new window.YT.Player(
            `video-${video.id}`,
            {
              videoId,
          playerVars: {
  fs: 0,               // Disable fullscreen
  modestbranding: 1,    // Minimal branding
  rel: 0,               // No related videos
  controls: 0,          // 🚀 Hide controls & title/link
  playsinline: 1,       
  enablejsapi: 1,
  origin: window.location.origin,
  iv_load_policy: 3,    // Hide annotations
  widget_referrer: window.location.href,
},
              events: {
                onReady: (event) => {
                  try {
                    const duration = event.target.getDuration();
                    updateVideoDuration(course.id, video.id, duration);
                    // Hide YouTube controls that we don't want
                    hideYouTubeControls(event.target);
                  } catch (e) {
                    console.error("onReady error:", e);
                  }
                },
                onStateChange: (event) => {
                  handleVideoStateChange(course.id, video.id, event);
                },
                onError: (event) => {
                  console.error("YouTube error:", event.data);
                },
              },
            }
          );
        });
      });
    } catch (error) {
      console.error("Error loading YouTube API:", error);
    }
  };
const hideYouTubeControls = (player) => {
  try {
    const iframe = document.getElementById(player.getIframe().id);
    if (!iframe) return;

    // Make parent relative for overlay positioning
    iframe.parentNode.style.position = "relative";

    // Overlay to cover the title bar (top area)
    const topOverlay = document.createElement("div");
    topOverlay.style.position = "absolute";
    topOverlay.style.top = "0";
    topOverlay.style.left = "0";
    topOverlay.style.width = "100%";
    topOverlay.style.height = "60px"; // Covers title + share area
    topOverlay.style.zIndex = "10";
    topOverlay.style.background = "transparent";
    topOverlay.style.pointerEvents = "auto"; // Block clicks

    // Overlay to cover the "Copy/Share" button area (bottom-right)
    const bottomOverlay = document.createElement("div");
    bottomOverlay.style.position = "absolute";
    bottomOverlay.style.bottom = "0";
    bottomOverlay.style.right = "0";
    bottomOverlay.style.width = "100px"; 
    bottomOverlay.style.height = "60px"; 
    bottomOverlay.style.zIndex = "10";
    bottomOverlay.style.background = "transparent";
    bottomOverlay.style.pointerEvents = "auto"; // Block clicks

    // Append overlays
    iframe.parentNode.appendChild(topOverlay);
    iframe.parentNode.appendChild(bottomOverlay);

  } catch (error) {
    console.log("Could not modify YouTube iframe:", error);
  }
};

  const updateVideoDuration = (courseId, videoId, duration) => {
    setDashboardData((prev) => {
      if (!prev?.courses) return prev;

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

    // Clear existing interval
    if (intervalRefs.current[videoId]) {
      clearInterval(intervalRefs.current[videoId]);
    }

    if (event.data === window.YT.PlayerState.PLAYING) {
      intervalRefs.current[videoId] = setInterval(() => {
        try {
          const duration = player.getDuration();
          const currentTime = player.getCurrentTime();
          let progress = Math.floor((currentTime / duration) * 100);
          const completed =
            event.data === window.YT.PlayerState.ENDED || progress >= 95;

          if (completed) progress = 100;

          updateVideoProgress(courseId, videoId, progress, completed);

          if (completed) {
            clearInterval(intervalRefs.current[videoId]);
          }
        } catch (e) {
          console.error("Error in progress tracking:", e);
          clearInterval(intervalRefs.current[videoId]);
        }
      }, 1000);
    }

    if (event.data === window.YT.PlayerState.ENDED) {
      updateVideoProgress(courseId, videoId, 100, true);
    }
  };

  const updateVideoProgress = (courseId, videoId, progress, completed) => {
    setDashboardData((prev) => {
      if (!prev?.courses) return prev;

      const newCourses = prev.courses.map((course) => {
        if (course.id !== courseId) return course;

        const newVideos = course.videos.map((v, index) => {
          if (v.id === videoId) {
            return { ...v, progress, completed };
          }

          // Unlock next video if current video is completed
          if (
            completed &&
            index > 0 &&
            course.videos[index - 1]?.id === videoId
          ) {
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

  // Init players once when dashboardData loads
  useEffect(() => {
    if (dashboardData) {
      initPlayers();
    }
  }, [dashboardData]);

  // Cleanup ONLY on unmount
  useEffect(() => {
    return () => {
      Object.values(playerRefs.current).forEach((player) => {
        try {
          if (player?.destroy) player.destroy();
        } catch {}
      });

      Object.values(intervalRefs.current).forEach((interval) => {
        if (interval) clearInterval(interval);
      });
    };
  }, []);

  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Loading your dashboard...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className={styles.retryBtn}>
          Try Again
        </button>
        <button
          onClick={() => router.push("/login")}
          className={styles.loginBtn}
        >
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
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaHome className={styles.menuIcon} />
            <span>Dashboard</span>
          </div>
          <div
            className={styles.menuItem}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaBook className={styles.menuIcon} />
            <span>My Courses</span>
          </div>
          <div
            className={styles.menuItem}
            onClick={() => setMobileMenuOpen(false)}
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
                            {video.locked && (
                              <span className={styles.lockedBadge}>Locked</span>
                            )}
                          </h4>
                          <span className={styles.videoDuration}>
                            {video.formattedDuration || "--:--"}
                          </span>
                        </div>

                        {video.locked ? (
                          <div className={styles.lockedOverlay}>
                            <FaLock size={32} />
                            <p>
                              Complete the previous video to unlock this content
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className={styles.videoContainer}>
                              <div
                                id={`video-${video.id}`}
                                className={styles.videoPlayer}
                                style={{
                                  backgroundColor: "#000",
                                }}
                              >
                                {!playerRefs.current[video.id] && (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      height: "100%",
                                      color: "#fff",
                                    }}
                                  >
                                    <FaSpinner className={styles.spinner} />
                                    <span style={{ marginLeft: "10px" }}>
                                      Loading video...
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className={styles.videoProgress}>
                              <div className={styles.progressBar}>
                                <div
                                  className={styles.progressFill}
                                  style={{ width: `${video.progress || 0}%` }}
                                />
                              </div>
                              <span>{video.progress || 0}% Watched</span>
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
