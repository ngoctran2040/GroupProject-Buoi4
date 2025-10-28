import React, { useState, useEffect, useMemo } from 'react'; // ✅ 1. Thêm useMemo
import axios from 'axios';
import './Auth.css'; // Dùng chung CSS

// Component hiển thị loading (cho đẹp)
const LoadingSpinner = () => (
  <div className="spinner-overlay">
    <div className="spinner"></div>
  </div>
);

function Profile() {
  // --- STATE CHO THÔNG TIN USER ---
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [avatarUrl, setAvatarUrl] = useState(''); // ✅ State mới cho Avatar
  
  // --- STATE ĐIỀU KHIỂN UI ---
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // ✅ State mới cho loading
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  // --- CẤU HÌNH HEADERS ---
  // ✅ 2. Dùng useMemo để "ghi nhớ" authHeaders
  // Chỉ tạo lại object này khi 'token' thay đổi.
  const authHeaders = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }), [token]);
  
  // ✅ Tương tự, dùng useMemo cho fileUploadHeaders
  const fileUploadHeaders = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }), [token]);

  // --- HÀM LOAD THÔNG TIN ---
  useEffect(() => {
    if (!token) {
      setError('Bạn cần đăng nhập để xem thông tin này.');
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3000/users/profile', authHeaders);
        setUserData(res.data);
        setFormData(res.data);
        setAvatarUrl(res.data.avatar?.url || ''); // ✅ Lấy URL avatar
      } catch (err) {
        setError('Không thể tải thông tin cá nhân. Vui lòng thử lại.');
        console.error(err);
      }
    };
    fetchProfile();
  }, [token, authHeaders]); // ✅ 3. Thêm authHeaders vào dependency array

  // --- HÀM XỬ LÝ SỰ KIỆN ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = (e) => {
    e.preventDefault();
    setIsEditing(!isEditing);
    setFormData(userData); // Reset form về dữ liệu gốc khi bấm Hủy
    setMessage('');
    setError('');
  };

  // 2. Xử lý CẬP NHẬT THÔNG TIN (Tên, Email)
  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.put('http://localhost:3000/users/profile', formData, authHeaders);
      setUserData(res.data.user); // Cập nhật lại state gốc
      setMessage(res.data.message || 'Cập nhật thành công!');
      setIsEditing(false); // Tắt chế độ sửa
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi cập nhật!');
    }
  };

  // ✅ 3. Xử lý UPLOAD AVATAR MỚI
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append('avatar', file); // 'avatar' phải khớp với route BE

    setError('');
    setMessage('');
    setIsUploading(true); // Bật loading

    try {
      const res = await axios.put(
        'http://localhost:3000/users/profile/avatar',
        bodyFormData,
        fileUploadHeaders // Dùng header cho file
      );
      setAvatarUrl(res.data.avatarUrl); // Cập nhật ảnh đại diện ngay lập tức
      setMessage(res.data.message || 'Upload avatar thành công!');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi upload ảnh!');
    } finally {
      setIsUploading(false); // Tắt loading
    }
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
      {/* ✅ Hiển thị loading spinner */}
      {isUploading && <LoadingSpinner />}

      <form className="auth-form" onSubmit={handleSubmitInfo}>
        <h2>Thông tin cá nhân</h2>
        
        {/* --- KHỐI AVATAR --- */}
        <div className="avatar-section">
          <img 
            src={avatarUrl || 'https://placehold.co/150x150/EFEFEF/AAAAAA?text=Avatar'} 
            alt="Avatar" 
            className="profile-avatar"
          />
          <input 
            type="file" 
            id="avatar-upload"
            onChange={handleAvatarChange}
            accept="image/png, image/jpeg"
            style={{ display: 'none' }} // Ẩn input gốc
          />
          <label htmlFor="avatar-upload" className="avatar-upload-button">
            Đổi ảnh
          </label>
        </div>
        
        {/* --- KHỐI THÔNG TIN --- */}
        {!isEditing ? (
          // --- CHẾ ĐỘ XEM (VIEW MODE) ---
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
          // --- CHẾ ĐỘ SỬA (EDIT MODE) ---
          <div className="profile-edit">
            <label htmlFor="name-input">Tên:</label>
            <input
              id="name-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <label htmlFor="email-input">Gmail:</label>
            <input
              id="email-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="button-group">
              <button type="submit" className="button-save">Lưu thay đổi</button>
              <button onClick={handleEditToggle} className="button-cancel">Hủy</button>
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

