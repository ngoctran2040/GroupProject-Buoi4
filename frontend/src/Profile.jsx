import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./Auth.css";

// Component hiển thị loading
const LoadingSpinner = () => (
  <div className="spinner-overlay">
    <div className="spinner"></div>
  </div>
);

function Profile() {
  // --- STATE CHO THÔNG TIN USER ---
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [avatarUrl, setAvatarUrl] = useState("");

  // --- STATE UI ---
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  // --- HEADER XÁC THỰC ---
  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  const fileUploadHeaders = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }),
    [token]
  );

  // --- HÀM FETCH PROFILE (có tự refresh token) ---
  useEffect(() => {
    if (!token) {
      setError("Bạn cần đăng nhập để xem thông tin này.");
      return;
    }

    const fetchProfile = async () => {
      try {
        // 🟢 Gọi API profile
        const res = await axios.get(
          "http://localhost:3000/users/profile",
          authHeaders
        );
        setUserData(res.data);
        setFormData(res.data);
        setAvatarUrl(res.data.avatar?.url || "");
      } catch (err) {
        // 🔴 Nếu token hết hạn → tự refresh token
        if (err.response?.status === 401 && refreshToken) {
          try {
            const refreshRes = await axios.post(
              "http://localhost:3000/auth/refresh",
              { token: refreshToken }
            );
            // ✅ Lưu lại token mới
            localStorage.setItem("token", refreshRes.data.accessToken);

            // ✅ Gọi lại API profile với token mới
            const retry = await axios.get(
              "http://localhost:3000/users/profile",
              {
                headers: {
                  Authorization: `Bearer ${refreshRes.data.accessToken}`,
                },
              }
            );
            setUserData(retry.data);
            setFormData(retry.data);
            setAvatarUrl(retry.data.avatar?.url || "");
          } catch (refreshErr) {
            console.error("Refresh token error:", refreshErr);
            setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          }
        } else {
          console.error(err);
          setError("Không thể tải thông tin cá nhân. Vui lòng thử lại.");
        }
      }
    };

    fetchProfile();
  }, [token, authHeaders, refreshToken]);

  // --- CẬP NHẬT THÔNG TIN ---
  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await axios.put(
        "http://localhost:3000/users/profile",
        formData,
        authHeaders
      );
      setUserData(res.data.user);
      setMessage(res.data.message || "Cập nhật thành công!");
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi cập nhật!");
    }
  };

  // --- UPLOAD AVATAR ---
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const bodyFormData = new FormData();
    bodyFormData.append("avatar", file);

    setIsUploading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.put(
        "http://localhost:3000/users/profile/avatar",
        bodyFormData,
        fileUploadHeaders
      );
      setAvatarUrl(res.data.avatarUrl);
      setMessage(res.data.message || "Upload avatar thành công!");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi upload ảnh!");
    } finally {
      setIsUploading(false);
    }
  };

  // --- CHUYỂN CHẾ ĐỘ EDIT ---
  const handleEditToggle = (e) => {
    e.preventDefault();
    setIsEditing(!isEditing);
    setFormData(userData);
    setMessage("");
    setError("");
  };

  // --- RENDER ---
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

        {/* --- AVATAR --- */}
        <div className="avatar-section">
          <img
            src={
              avatarUrl ||
              "https://placehold.co/150x150/EFEFEF/AAAAAA?text=Avatar"
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

        {/* --- THÔNG TIN NGƯỜI DÙNG --- */}
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
