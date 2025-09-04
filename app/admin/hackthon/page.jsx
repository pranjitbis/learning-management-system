"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import style from "./style.module.css";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", email: "", rank: "" });
  const [storeData, setStoreData] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const openClose = () => {
    setOpen(!open);
    setEditMode(false);
    setFormData({ id: "", name: "", email: "", rank: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/hackthon");
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/unauthorized");
          return;
        }
        throw new Error("Failed to fetch data");
      }
      
      const data = await res.json();
      setStoreData(data);
    } catch (err) {
      console.error("Fetch error:", err.message);
      setStoreData([]);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check", {
        credentials: "include",
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUserRole(userData.role);
        
        // Redirect if not admin
        if (userData.role !== "ADMIN") {
          // Allow viewing but not editing
          console.log("User is not admin, view-only mode");
        }
      } else {
        // Not authenticated, redirect to login
        router.push("/login");
      }
    } catch (err) {
      console.error("Error checking authentication:", err);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editMode ? "PUT" : "POST";
      const res = await fetch("/api/hackthon", {
        method,
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      
      if (res.status === 401) {
        alert("Your session has expired. Please log in again.");
        router.push("/login");
        return;
      }
      
      if (!res.ok) throw new Error("Failed to save");
      
      await res.json();
      fetchData();
      openClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const handleEdit = (item) => {
    if (userRole !== "ADMIN") {
      alert("You don't have permission to edit");
      return;
    }
    
    setEditMode(true);
    setOpen(true);
    setFormData(item);
  };

  const handleDelete = async (id) => {
    if (userRole !== "ADMIN") {
      alert("You don't have permission to delete");
      return;
    }
    
    if (!confirm("Are you sure you want to delete this record?")) return;
    
    try {
      const res = await fetch("/api/hackthon", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
        credentials: "include",
      });
      
      if (res.status === 401) {
        alert("Your session has expired. Please log in again.");
        router.push("/login");
        return;
      }
      
      if (!res.ok) throw new Error("Failed to delete");
      
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  if (isLoading) {
    return <div className={style.container}>Loading...</div>;
  }

  return (
    <div className={style.container}>
      <div className={style.card}>
        <h1 className={style.heading}>Hackathon Management</h1>
        {userRole === "ADMIN" && (
          <button onClick={openClose} className={style.button}>
            {open ? "Close Form" : "Add User Data"}
          </button>
        )}
      </div>

      {open && userRole === "ADMIN" && (
        <form className={style.form} onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="number" name="rank" placeholder="Rank" value={formData.rank || ""} onChange={handleChange} />
          <button type="submit">{editMode ? "Update" : "Submit"}</button>
        </form>
      )}

      <table className={style.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Rank</th>
            {userRole === "ADMIN" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {storeData.length > 0 ? (
            storeData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.rank || "-"}</td>
                {userRole === "ADMIN" && (
                  <td>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={userRole === "ADMIN" ? 5 : 4}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}