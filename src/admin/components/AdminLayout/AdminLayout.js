import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './AdminLayout.css';

const AdminLayout = ({ isAuthenticated, setIsAuthenticated }) => {
  return (
    <div className="admin-layout">
      <Sidebar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
