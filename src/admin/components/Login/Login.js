import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaUserCircle } from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode';
import { loginUser } from '../../../api';
import './Login.css';

const Login = ({ setIsAuthenticated, setUserType }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, userType } = await loginUser(username, password);
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      if (rememberMe) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        localStorage.setItem('token', token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('userId', userId);
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userType', userType);
        sessionStorage.setItem('userId', userId);
      }
      setIsAuthenticated(true);
      setUserType(userType);
      navigate('/adminpanel');
    } catch (error) {
      setError('Kullanıcı adı veya şifre yanlış');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <FaUserCircle className="user-icon" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-input">
            <span className="icon"><FaUser /></span>
            <input
              type="text"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-input">
            <span className="icon"><FaLock /></span>
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Beni hatırla
            </label>
          </div>
          <button type="submit" className="login-button">Giriş Yap</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
