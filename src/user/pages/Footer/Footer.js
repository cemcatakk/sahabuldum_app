import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { FaHome, FaFutbol, FaInfoCircle, FaPhone, FaTools } from 'react-icons/fa';
import logo from '../Header/logo.png'; // Logo dosyasını ekleyin

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Sahabuldum" />
          <p>Sahabuldum en iyi halı saha deneyimini sunar.</p>
        </div>
        <div className="footer-links">
          <ul>
            <li><Link to="/"><FaHome className="footer-icon" /><span className="footer-text">Anasayfa</span></Link></li>
            <li><Link to="/sahalarimiz"><FaFutbol className="footer-icon" /><span className="footer-text">Sahalarımız</span></Link></li>
            <li><Link to="/hakkimizda"><FaInfoCircle className="footer-icon" /><span className="footer-text">Hakkımızda</span></Link></li>
            <li><Link to="/iletisim"><FaPhone className="footer-icon" /><span className="footer-text">İletişim</span></Link></li>
            <li><Link to="/adminpanel"><FaTools className="footer-icon" /><span className="footer-text">Yönetici Paneli</span></Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>©2022 Sahabuldum. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;
