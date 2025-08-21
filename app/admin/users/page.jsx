"use client";
import { useEffect, useState } from "react";
import {
  FiUserPlus,
  FiTrash2,
  FiX,
  FiUser,
  FiLock,
  FiMail,
  FiSave,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import { FaUserShield, FaUserGraduate, FaEllipsisV } from "react-icons/fa";
import { RiShieldUserLine } from "react-icons/ri";
import styles from "./users.module.css";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grantingAccess, setGrantingAccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, coursesRes] = await Promise.all([
        fetch("/api/users?includeAccess=true"),
        fetch("/api/courses"),
      ]);

      if (!usersRes.ok) throw new Error("Failed to fetch users");
      if (!coursesRes.ok) throw new Error("Failed to fetch courses");

      const usersData = await usersRes.json();
      const coursesData = await coursesRes.json();

      setUsers(usersData);
      setCourses(coursesData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.status === 400) {
        alert("Email already registered.");
        return;
      }

      if (!res.ok) throw new Error("Failed to add user");

      const addedUser = await res.json();
      setUsers((prev) => [...prev, addedUser]);
      setNewUser({ name: "", email: "", password: "", role: "USER" });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setError(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleUserExpansion = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const handleGrantAccess = async (userId, courseId) => {
    if (!courseId) return;

    try {
      setGrantingAccess({ userId });

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "grantAccess", userId, courseId }),
      });

      if (!res.ok) throw new Error("Failed to grant access");

      const updatedUser = await res.json();

      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
    } catch (err) {
      alert(err.message);
    } finally {
      setGrantingAccess(null);
    }
  };

  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <FiRefreshCw className={styles.loadingSpinner} />
        <p>Loading users...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={fetchData} className={styles.retryButton}>
          <FiRefreshCw /> Retry
        </button>
      </div>
    );
  return (
    <div className={styles.adminContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <RiShieldUserLine className={styles.titleIcon} />
            <span>User Management</span>
          </h1>
          <p className={styles.subtitle}>
            Manage all system users and their access
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <FiUserPlus className={styles.buttonIcon} />
            {showAddForm ? "Cancel" : "Add User"}
          </button>
          <button
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={fetchData}
          >
            <FiRefreshCw className={styles.buttonIcon} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInputContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search users..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{users.length}</span>
            <span className={styles.statLabel}>Total Users</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {users.filter((u) => u.role === "ADMIN").length}
            </span>
            <span className={styles.statLabel}>Admins</span>
          </div>
        </div>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>Add New User</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Full Name *</label>
              <div className={styles.inputWithIcon}>
                <FiUser className={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email *</label>
              <div className={styles.inputWithIcon}>
                <FiMail className={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password *</label>
              <div className={styles.inputWithIcon}>
                <FiLock className={styles.inputIcon} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Role</label>
              <div className={styles.roleSelector}>
                <button
                  className={`${styles.roleButton} ${
                    newUser.role === "USER" ? styles.activeRole : ""
                  }`}
                  onClick={() => setNewUser({ ...newUser, role: "USER" })}
                  type="button"
                >
                  <FaUserGraduate className={styles.roleIcon} />
                  <span>Standard User</span>
                </button>
                <button
                  className={`${styles.roleButton} ${
                    newUser.role === "ADMIN" ? styles.activeRole : ""
                  }`}
                  onClick={() => setNewUser({ ...newUser, role: "ADMIN" })}
                  type="button"
                >
                  <FaUserShield className={styles.roleIcon} />
                  <span>Administrator</span>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
            <button
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={handleAddUser}
            >
              <FiSave className={styles.buttonIcon} /> Create User
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className={styles.usersTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableRow}>
            <div className={`${styles.tableCell} ${styles.cellUser}`}>User</div>
            <div className={`${styles.tableCell} ${styles.cellEmail}`}>
              Email
            </div>
            <div className={`${styles.tableCell} ${styles.cellRole}`}>Role</div>
            <div className={`${styles.tableCell} ${styles.cellAccess}`}>
              Access
            </div>
            <div className={`${styles.tableCell} ${styles.cellActions}`}>
              Actions
            </div>
          </div>
        </div>

        <div className={styles.tableBody}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`${styles.tableRow} ${styles.tableRowItem}`}
              >
                <div className={`${styles.tableCell} ${styles.cellUser}`}>
                  <div className={styles.userAvatar}>
                    {user.role === "ADMIN" ? (
                      <FaUserShield className={styles.avatarIconAdmin} />
                    ) : (
                      <FaUserGraduate className={styles.avatarIconUser} />
                    )}
                  </div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>
                      {user.name || "No Name"}
                    </span>
                    <span className={styles.userId}>ID: {user.id}</span>
                  </div>
                </div>

                <div className={`${styles.tableCell} ${styles.cellEmail}`}>
                  <span className={styles.emailText}>{user.email}</span>
                </div>

                <div className={`${styles.tableCell} ${styles.cellRole}`}>
                  <span
                    className={`${styles.roleBadge} ${
                      user.role === "ADMIN" ? styles.roleAdmin : styles.roleUser
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className={`${styles.tableCell} ${styles.cellAccess}`}>
                  <span className={styles.accessCount}>
                    {user.access?.length || 0} courses
                  </span>
                </div>

                <div className={`${styles.tableCell} ${styles.cellActions}`}>
                  <div className={styles.actionsContainer}>
                    <button
                      className={styles.moreButton}
                      onClick={() => toggleUserExpansion(user.id)}
                    >
                      <FaEllipsisV />
                    </button>

                    {expandedUser === user.id && (
                      <div className={styles.expandedActions}>
                        <div className={styles.actionDropdown}>
                          <div className={styles.actionHeader}>
                            <h4>Manage User</h4>
                            <button
                              className={styles.closeDropdown}
                              onClick={() => setExpandedUser(null)}
                            >
                              <FiX />
                            </button>
                          </div>

                          <div className={styles.actionContent}>
                            <div className={styles.actionSection}>
                              <h5>Course Access</h5>
                              <select
                                className={styles.accessSelect}
                                onChange={(e) =>
                                  handleGrantAccess(
                                    user.id,
                                    parseInt(e.target.value)
                                  )
                                }
                                defaultValue=""
                                disabled={grantingAccess?.userId === user.id}
                              >
                                <option value="">
                                  Select course to grant access
                                </option>
                                {courses.map((course) => (
                                  <option key={course.id} value={course.id}>
                                    {course.title}
                                  </option>
                                ))}
                              </select>
                              {grantingAccess?.userId === user.id && (
                                <div className={styles.grantingIndicator}>
                                  Granting access...
                                </div>
                              )}
                            </div>

                            {user.access?.length > 0 && (
                              <div className={styles.actionSection}>
                                <h5>Current Access</h5>
                                <ul className={styles.accessList}>
                                  {user.access.map((access) => (
                                    <li
                                      key={access.id}
                                      className={styles.accessItem}
                                    >
                                      <span>
                                        {access.course?.title || access.name}
                                      </span>
                                      <button
                                        className={styles.removeAccessButton}
                                        onClick={() =>
                                          handleRemoveAccess(user.id, access.id)
                                        }
                                      >
                                        <FiX />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className={styles.actionButtons}>
                              <button
                                className={`${styles.button} ${styles.dangerButton} ${styles.smallButton}`}
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <FiTrash2 /> Delete User
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIllustration}>
                <FiUser className={styles.emptyIcon} />
              </div>
              <h4>No users found</h4>
              <p>Try adjusting your search or add a new user</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
