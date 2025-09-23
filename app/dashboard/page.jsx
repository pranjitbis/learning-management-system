"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  FaSync,
} from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { FiMenu, FiX } from "react-icons/fi";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const playerRefs = useRef({});
  const intervalRefs = useRef({});
  const updatedDurations = useRef(new Set());
  const router = useRouter();

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("lms_token");
      return !!token;
    }
    return false;
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated()) {
        router.push("/login?from=/dashboard");
        return;
      }

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
        cache: "no-store",
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

      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        localStorage.removeItem("lms_token");
        router.push("/login?from=/dashboard");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated, router]);

  // Refresh dashboard data
  const refreshDashboardData = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Update video data in database
  const updateVideoData = useCallback(
    async (videoId, duration, progress, completed) => {
      try {
        const token = localStorage.getItem("lms_token");
        if (!token) return;

        const updateData = {
          videoId: parseInt(videoId),
        };

        // Only include duration if it's valid and greater than 0
        if (duration !== undefined && duration > 0) {
          updateData.duration = Math.round(duration);
        }

        // Include progress update if provided
        if (progress !== undefined || completed !== undefined) {
          updateData.progress = progress || 0;
          updateData.completed = completed || false;
        }

        const response = await fetch("/api/dashboard", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          throw new Error(`Failed to update video data: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Failed to update video data in database:", error);
        throw error;
      }
    },
    []
  );

  // Enhanced video duration update function
  const updateVideoDuration = useCallback(
    async (courseId, videoId, duration) => {
      if (!duration || duration <= 0) return;

      const durationKey = `${videoId}-${Math.round(duration)}`;

      // Only update if we haven't already updated this specific duration
      if (!updatedDurations.current.has(durationKey)) {
        try {
          // Update local state immediately for better UX
          setDashboardData((prev) => {
            if (!prev?.courses) return prev;

            const newCourses = prev.courses.map((course) => {
              if (course.id !== courseId) return course;

              const newVideos = course.videos.map((v) => {
                if (v.id === videoId) {
                  return {
                    ...v,
                    duration: duration,
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

          // Save to database
          await updateVideoData(videoId, duration);
          updatedDurations.current.add(durationKey);

          console.log(
            `Duration updated for video ${videoId}: ${duration} seconds`
          );
        } catch (error) {
          console.error("Error updating video duration:", error);
        }
      }
    },
    [updateVideoData]
  );

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

  // YouTube ID extraction
  const getYouTubeId = (url) => {
    if (!url) return null;

    if (url.includes("youtube.com/embed/")) {
      return url.split("youtube.com/embed/")[1].split("?")[0];
    }

    if (url.includes("youtube.com/watch?v=")) {
      return url.split("v=")[1].split("&")[0];
    }

    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split("?")[0];
    }

    if (url.length === 11 && !url.includes("/") && !url.includes("?")) {
      return url;
    }

    return null;
  };

  // YouTube API loading
  const loadYouTubeAPI = () => {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }

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

  // Enhanced progress update function
  const updateVideoProgress = useCallback(
    async (courseId, videoId, progress, completed) => {
      try {
        // Update database first
        await updateVideoData(videoId, null, progress, completed);

        // Then update local state
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
            const totalVideos = newVideos.length;
            const courseCompleted =
              totalVideos > 0 && completedVideos === totalVideos;

            return {
              ...course,
              videos: newVideos,
              progress: {
                videosWatched: completedVideos,
                totalVideos,
                completed: courseCompleted,
                completionPercentage: courseCompleted
                  ? 100
                  : Math.round((completedVideos / totalVideos) * 100),
              },
            };
          });

          return { ...prev, courses: newCourses };
        });
      } catch (error) {
        console.error("Error updating video progress:", error);
      }
    },
    [updateVideoData]
  );

  // Handle video state change with real-time duration updates
  const handleVideoStateChange = useCallback(
    (courseId, videoId, event) => {
      const player = playerRefs.current[videoId];
      if (!player) return;

      // Clear existing interval
      if (intervalRefs.current[videoId]) {
        clearInterval(intervalRefs.current[videoId]);
      }

      if (event.data === window.YT.PlayerState.PLAYING) {
        // Get and update duration when video starts playing
        try {
          const duration = player.getDuration();
          if (duration && duration > 0) {
            updateVideoDuration(courseId, videoId, duration);
          }
        } catch (e) {
          console.error("Error getting duration on play:", e);
        }

        // Start progress tracking
        intervalRefs.current[videoId] = setInterval(async () => {
          try {
            const duration = player.getDuration();
            const currentTime = player.getCurrentTime();

            // Update duration periodically while playing
            if (duration && duration > 0) {
              updateVideoDuration(courseId, videoId, duration);
            }

            let progress =
              duration > 0 ? Math.floor((currentTime / duration) * 100) : 0;
            const isEnded = event.data === window.YT.PlayerState.ENDED;
            const completed = isEnded || progress >= 95;

            if (completed) progress = 100;

            // Update both local state and database
            await updateVideoProgress(courseId, videoId, progress, completed);

            if (completed) {
              clearInterval(intervalRefs.current[videoId]);
              console.log(`Video ${videoId} completed`);
            }
          } catch (e) {
            console.error("Error in progress tracking:", e);
            clearInterval(intervalRefs.current[videoId]);
          }
        }, 3000);
      }

      if (event.data === window.YT.PlayerState.PAUSED) {
        // Update duration when paused
        try {
          const duration = player.getDuration();
          if (duration && duration > 0) {
            updateVideoDuration(courseId, videoId, duration);
          }
        } catch (e) {
          console.error("Error getting duration on pause:", e);
        }
      }

      if (event.data === window.YT.PlayerState.ENDED) {
        // Final updates when video ends
        try {
          const duration = player.getDuration();
          if (duration && duration > 0) {
            updateVideoDuration(courseId, videoId, duration);
          }
        } catch (e) {
          console.error("Error getting final duration:", e);
        }

        updateVideoProgress(courseId, videoId, 100, true);
      }
    },
    [updateVideoDuration, updateVideoProgress]
  );

  const initPlayers = async () => {
    if (!dashboardData?.courses) return;

    try {
      await loadYouTubeAPI();

      dashboardData.courses.forEach((course) => {
        course.videos.forEach((video) => {
          if (video.locked) return;

          const videoId = getYouTubeId(video.url);
          if (!videoId) return;

          if (playerRefs.current[video.id]) return;

          playerRefs.current[video.id] = new window.YT.Player(
            `video-${video.id}`,
            {
              videoId,
              playerVars: {
                autoplay: 0,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                iv_load_policy: 3,
                fs: 0,
                disablekb: 1,
                playsinline: 1,
                enablejsapi: 1,
                origin: window.location.origin,
              },
              events: {
                onReady: (event) => {
                  try {
                    const duration = event.target.getDuration();

                    // Always update duration when video loads
                    if (duration && duration > 0) {
                      updateVideoDuration(course.id, video.id, duration);
                    }

                    hideYouTubeUI(video.id);
                    addSecurityOverlay(video.id, event.target);
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

  const hideYouTubeUI = (videoId) => {
    setTimeout(() => {
      const iframe = document
        .getElementById(`video-${videoId}`)
        ?.querySelector("iframe");
      if (!iframe) return;

      try {
        const style = document.createElement("style");
        style.textContent = `
        .ytp-title,
        .ytp-chrome-top,
        .ytp-share-button,
        .ytp-button.ytp-settings-button {
          display: none !important;
          pointer-events: none !important;
        }
      `;
        iframe.contentWindow?.document?.head?.appendChild(style);
      } catch {
        // Fallback to overlay
      }
    }, 1000);
  };

  const addSecurityOverlay = (videoId, player) => {
    const container = document.getElementById(`video-${videoId}`);
    if (!container) return;

    container.parentElement.style.position = "relative";

    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "10";
    overlay.style.background = "transparent";
    overlay.style.cursor = "pointer";

    overlay.oncontextmenu = (e) => e.preventDefault();

    overlay.addEventListener("click", () => {
      if (player.getPlayerState() === window.YT.PlayerState.PLAYING) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    });

    container.parentElement.appendChild(overlay);
  };

  // Initialize players when data loads
  useEffect(() => {
    if (dashboardData) {
      initPlayers();
    }
  }, [dashboardData]);

  // Cleanup on unmount
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

      updatedDurations.current.clear();
    };
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (dashboardData && !loading) {
        refreshDashboardData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [dashboardData, loading, refreshDashboardData]);

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
        <button
          className={styles.refreshBtn}
          onClick={refreshDashboardData}
          disabled={refreshing}
        >
          <FaSync className={refreshing ? styles.spinning : ""} />
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
          <div className={styles.headerTop}>
            <h1>Welcome back, {dashboardData?.user?.name?.split(" ")[0]}!</h1>
          </div>
          <p>Continue your learning journey</p>
        </div>

        <section className={styles.coursesSection}>
          <h2 className={styles.sectionTitle}>
            <FaBook className={styles.sectionIcon} />
            Your Courses
            <span className={styles.courseCount}>
              ({dashboardData?.courses?.length || 0})
            </span>
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
                        {course.progress.completionPercentage}% Complete (
                        {course.progress.videosWatched}/
                        {course.progress.totalVideos} videos)
                      </span>
                    </div>
                  </div>

                  <div className={styles.videosList}>
                    {course.videos.map((video, index) => (
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
                            {video.duration && (
                              <span
                                className={styles.durationSaved}
                                title="Duration saved in database"
                              >
                                💾
                              </span>
                            )}
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
                              {video.completed && (
                                <span className={styles.completedBadge}>
                                  Completed
                                </span>
                              )}
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
