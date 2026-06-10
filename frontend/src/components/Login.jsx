import React, { useState } from 'react';
import api from '../api/axios';

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
        onLoginSuccess(response.data);
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Không thể kết nối đến máy chủ. Vui lòng đảm bảo Backend đang chạy.');
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng!');
      }
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal">
        <div className="modal-header">
          <h3>Đăng Nhập</h3>
        </div>
        <div className="modal-body">
          {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Đăng Nhập</button>
            <p style={{marginTop: '15px', textAlign: 'center'}}>
              Chưa có tài khoản? <a href="#" onClick={(e) => {e.preventDefault(); onSwitchToRegister();}}>Đăng ký ngay</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
