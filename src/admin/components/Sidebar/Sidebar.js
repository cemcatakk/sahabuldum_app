import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignOutAlt, FaPlusCircle, FaList, FaUser } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ userType, handleLogout }) => {
  return (
    <div className="sidebar">
      <h2>Sahabuldum</h2>
      <ul>
         {!userType &&  <li>
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
  );
};

export default Sidebar;
