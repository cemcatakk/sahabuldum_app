import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaFutbol, FaInfoCircle, FaPhone, FaTools } from 'react-icons/fa';
import './Header.css';
import logo from './logo.png';
import { Helmet } from 'react-helmet';

const Header = () => {
  return (
    <header className="header">
       <Helmet>
        <title>Sahabuldum | Halı Saha Arama ve Kiralama</title>
        <meta name="description" content="Sahabuldum ile İzmir ve çevresinde halı saha arayın ve kiralayın. En iyi halı saha deneyimi için Sahabuldum." />
      </Helmet>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Sahabuldum" />
          <span className="site-name">Sahabuldum</span>
        </Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/"><FaHome className="nav-icon" /><span className="nav-text">Anasayfa</span></Link></li>
          <li><Link to="/sahalarimiz"><FaFutbol className="nav-icon" /><span className="nav-text">Sahalarımız</span></Link></li>
          <li><Link to="/hakkimizda"><FaInfoCircle className="nav-icon" /><span className="nav-text">Hakkımızda</span></Link></li>
          <li><Link to="/iletisim"><FaPhone className="nav-icon" /><span className="nav-text">İletişim</span></Link></li>
          <li><Link to="/adminpanel/owner-fields"><FaTools className="footer-icon" /><span className="footer-text">Yönetici Paneli</span></Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

