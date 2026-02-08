import { useEffect, useState } from "react";
import API from "../services/api";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  name: string;
  email?: string;
  avatarUrl?: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"logout" | "delete" | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/me");
        const fetchedUser = res.data.user || null;
        setUser(fetchedUser);
        setNameInput(fetchedUser?.name || "");
        setError("");
      } catch (err) {
        const axiosErr = err as AxiosError<string>;
        setError(axiosErr.response?.data || "Failed to load profile");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    if (!nameInput.trim()) {
      setError("Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const res = await API.patch('/users/me', { name: nameInput.trim() });
      const updatedUser = res.data.user;
      setUser(updatedUser);
      setEditing(false);
      setError("");
    } catch (err) {
      const axiosErr = err as AxiosError<string>;
      setError(axiosErr.response?.data || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    window.dispatchEvent(new Event("app:loading"));
    localStorage.removeItem("token");
    navigate("/");
    window.dispatchEvent(new Event("app:loaded"));
  };

  const handleDeleteAccount = async () => {
    try {
      window.dispatchEvent(new Event("app:loading"));
      await API.delete("/users/me");
      localStorage.removeItem("token");
      navigate("/signup");
    } catch (err) {
      const axiosErr = err as AxiosError<string>;
      setError(axiosErr.response?.data || "Failed to delete account");
    } finally {
      window.dispatchEvent(new Event("app:loaded"));
    }
  };

  const openConfirm = (type: "logout" | "delete") => {
    setConfirmType(type);
    setIsConfirmOpen(true);
  };

  const closeConfirm = () => {
    setIsConfirmOpen(false);
    setConfirmType(null);
  };

  const handleConfirm = async () => {
    if (confirmType === "logout") {
      handleLogout();
      return;
    }
    if (confirmType === "delete") {
      await handleDeleteAccount();
    }
  };

  return (
    <main className="container page-profile">
      <div className="profile-header">
        <div className="profile-title-row">
          <h2>My profile</h2>
        </div>
        <p className="profile-subtitle">Manage your account details and display name.</p>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {user && (
        <section className="profile-card">
          <div className="profile-card-header">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="profile-avatar profile-avatar-lg" />
            ) : (
              <div className="profile-avatar profile-avatar-lg">
                {user.name?.split("").slice(0, 2).join("")}
              </div>
            )}
            <div className="profile-meta">
              {!editing ? (
                <div className="profile-name-row">
                  <div className="profile-name">{user.name}</div>
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setEditing(true);
                      setNameInput(user.name);
                    }}
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="profile-edit-row">
                  <input
                    className="profile-input"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                  <button className="btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => {
                      setEditing(false);
                      setNameInput(user.name);
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {user.email && <div className="profile-email">{user.email}</div>}
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn-delete" onClick={() => openConfirm("logout")}>Logout</button>
            <button className="btn-delete" onClick={() => openConfirm("delete")}>Delete account</button>
          </div>
        </section>
      )}

      {isConfirmOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{confirmType === "delete" ? "Delete Account" : "Log Out"}</h3>
              <button className="modal-close" onClick={closeConfirm} aria-label="Close">
                ×
              </button>
            </div>
            <div className="modal-warning">
              <span className="warning-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3l9 16H3l9-16z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M12 9v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="17" r="1" fill="currentColor" />
                </svg>
              </span>
              <div>
                <p className="warning-title">
                  {confirmType === "delete" ? "This action cannot be undone." : "You will be signed out."}
                </p>
                <p className="warning-text">
                  {confirmType === "delete"
                    ? "This will permanently delete your account and projects."
                    : "You can log back in anytime using your credentials."}
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeConfirm}>Cancel</button>
              <button className="btn-delete" onClick={handleConfirm}>
                {confirmType === "delete" ? "Delete" : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
