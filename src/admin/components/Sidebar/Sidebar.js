import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSignOutAlt, FaPlusCircle, FaList, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ userType, handleLogout }) => {
  const nameSurname = localStorage.getItem("namesurname");
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <Link className='home-link' to="/">
          <h2>Sahabuldum</h2>
        </Link>
        {nameSurname && <p className="welcome-text"><FaUser /> Merhaba {nameSurname}</p>}
        <ul>
          {!userType && <li>
            <Link to="/adminpanel/login"><FaUser /> Giriş Yap</Link>
          </li>}
          {userType === 'admin' && (
            <>
              <li>
                <Link to="/adminpanel"><FaList /> Halı Saha Sağlayıcıları</Link>
              </li>
              <li>
                <Link to="/adminpanel/add-provider"><FaPlusCircle /> Halı Saha Sağlayıcısı Ekle</Link>
              </li>
              <li>
                <Link to="/adminpanel/owner-fields"><FaList /> Sahalarım</Link>
              </li>
              <li>
                <Link to="/adminpanel/owner-dashboard"><FaList /> Üye Yönetimi</Link>
              </li>
            </>
          )}
          {userType === 'provider' && (
            <>
              <li>
                <Link to="/adminpanel/owner-fields"><FaList /> Sahalarım</Link>
              </li>
            </>
          )}
          {userType && (
            <li>
              <a href='#' onClick={handleLogout} className="logout"><FaSignOutAlt /> Çıkış Yap</a>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
