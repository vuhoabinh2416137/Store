import React, { useState } from 'react';
import api from '../api/axios';

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { username, password, fullName });
      onRegisterSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.message 
        || err.response?.data?.error 
        || (err.code === 'ERR_NETWORK' ? 'Không thể kết nối đến máy chủ. Vui lòng đảm bảo Backend đang chạy.' : null)
        || 'Đăng ký thất bại!';
      setError(errorMsg);
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal">
        <div className="modal-header">
          <h3>Đăng Ký</h3>
        </div>
        <div className="modal-body">
          {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Họ và Tên</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Đăng Ký</button>
            <p style={{marginTop: '15px', textAlign: 'center'}}>
              Đã có tài khoản? <a href="#" onClick={(e) => {e.preventDefault(); onSwitchToLogin();}}>Đăng nhập</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
