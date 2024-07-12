import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import FieldProviderForm from './components/FieldProviderForm/FieldProviderForm';
import FieldOwnerDashboard from './components/FieldOwnerDashboard/FieldOwnerDashboard';
import FieldSchedule from './components/FieldSchedule/FieldSchedule';
import OwnerFields from './components/OwnerFields/OwnerFields';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './components/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';

function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType') || sessionStorage.getItem('userType');
    if (token) {
      setIsAuthenticated(true);
      setUserType(storedUserType);
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUserType('');
  };
  return (
    <div className="admin-panel">
      <Sidebar userType={userType} handleLogout={handleLogout} />
      {isAuthenticated ? (
        <>
          <Routes>
            {userType === 'admin' ? (
              <>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/add-provider" element={<FieldProviderForm />} />
                <Route path="/edit-provider/:id" element={<FieldProviderForm />} />
                <Route path="/owner-dashboard" element={<FieldOwnerDashboard />} />
                <Route path="/owner-fields" element={<OwnerFields />} />
                <Route path="/field-schedule/:fieldId" element={<FieldSchedule />} />
              </>
            ) : (
		 <>
                <Route path="/owner-fields" element={<OwnerFields />} />
                <Route path="/field-schedule/:fieldId" element={<FieldSchedule />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserType={setUserType} />} />
        </Routes>
      )}
      <ToastContainer />
    </div>
  );
}

export default AdminApp;
