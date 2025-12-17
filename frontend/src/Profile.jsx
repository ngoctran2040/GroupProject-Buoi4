import React, { useState, useEffect } from "react";
import API from "./utils/axiosInstance";
import "./Auth.css";

const LoadingSpinner = () => (
  <div className="spinner-overlay">
    <div className="spinner"></div>
  </div>
);

function Profile() {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        setUserData(res.data);
        setFormData(res.data);
        setAvatarUrl(res.data.avatar?.url || "");
      } catch (err) {
        console.error(err);
        setError("Không thể tải thông tin cá nhân. Vui lòng thử lại.");
      }
    };
    fetchProfile();
  }, []);

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await API.put("/users/profile", formData);
      setUserData(res.data.user);
      setMessage(res.data.message || "Cập nhật thành công!");
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi cập nhật!");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append("avatar", file);
    setIsUploading(true);
    setMessage("");
    setError("");
    try {
      const res = await API.put("/users/profile/avatar", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatarUrl(res.data.avatarUrl);
      setMessage(res.data.message || "Upload avatar thành công!");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi upload ảnh!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditToggle = (e) => {
    e.preventDefault();
    setIsEditing(!isEditing);
    setFormData(userData);
    setMessage("");
    setError("");
  };

  if (error && !userData.email) {
    return (
      <div className="auth-container">
        <p className="message">{error}</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {isUploading && <LoadingSpinner />}
      <form className="auth-form" onSubmit={handleSubmitInfo}>
        <h2>Thông tin cá nhân</h2>

        <div className="avatar-section">
          <img
            src={
              avatarUrl || "https://placehold.co/150x150/EFEFEF/AAAAAA?text=Avatar"
            }
            alt="Avatar"
            className="profile-avatar"
          />
          <input
            type="file"
            id="avatar-upload"
            onChange={handleAvatarChange}
            accept="image/png, image/jpeg"
            style={{ display: "none" }}
          />
          <label htmlFor="avatar-upload" className="avatar-upload-button">
            Đổi ảnh
          </label>
        </div>

        {!isEditing ? (
          <div className="profile-view">
            <div className="view-field">
              <label>Tên:</label>
              <p>{userData.name}</p>
            </div>
            <div className="view-field">
              <label>Gmail:</label>
              <p>{userData.email}</p>
            </div>
            <button onClick={handleEditToggle}>Cập nhật thông tin</button>
          </div>
        ) : (
          <div className="profile-edit">
            <label htmlFor="name-input">Tên:</label>
            <input
              id="name-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              required
            />

            <label htmlFor="email-input">Gmail:</label>
            <input
              id="email-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              required
            />

            <div className="button-group">
              <button type="submit" className="button-save">
                Lưu thay đổi
              </button>
              <button onClick={handleEditToggle} className="button-cancel">
                Hủy
              </button>
            </div>
          </div>
        )}

        {message && <p className="message success">{message}</p>}
        {error && <p className="message">{error}</p>}
      </form>
    </div>
  );
}

export default Profile;
