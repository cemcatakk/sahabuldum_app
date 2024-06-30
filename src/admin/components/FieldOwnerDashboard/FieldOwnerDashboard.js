import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../../api';
import './FieldOwnerDashboard.css';

const FieldOwnerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({ id: null, firstName: '', lastName: '', username: '', password: '', type: 'admin' });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getUsers();
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (currentUser.firstName && currentUser.lastName && currentUser.username && currentUser.password) {
      const newUser = await createUser(currentUser);
      setUsers([...users, newUser]);
      setCurrentUser({ id: null, firstName: '', lastName: '', username: '', password: '', type: 'admin' });
    }
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsEditMode(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const updatedUser = await updateUser(currentUser.id, currentUser);
    setUsers(users.map(user => (user.id === currentUser.id ? updatedUser : user)));
    setCurrentUser({ id: null, firstName: '', lastName: '', username: '', password: '', type: 'admin' });
    setIsEditMode(false);
  };

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    setUsers(users.filter(user => user.id !== id));
  };

  const renderUserType = (type) => {
    switch (type) {
      case 'admin':
        return 'Yönetici';
      case 'provider':
        return 'Halı Saha Sahibi';
      default:
        return '';
    }
  };

  return (
    <div className="field-owner-dashboard">
      <h2>Kullanıcı Yönetimi</h2>
      <form onSubmit={isEditMode ? handleUpdateUser : handleAddUser}>
        <div className="form-group">
          <label>Ad</label>
          <input type="text" name="firstName" value={currentUser.firstName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Soyad</label>
          <input type="text" name="lastName" value={currentUser.lastName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Kullanıcı Adı</label>
          <input type="text" name="username" value={currentUser.username} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Şifre</label>
          <input type="password" name="password" value={currentUser.password} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Kullanıcı Tipi</label>
          <select name="type" value={currentUser.type} onChange={handleInputChange} required>
            <option value="admin">Yönetici</option>
            <option value="provider">Halı Saha Sahibi</option>
          </select>
        </div>
        <button type="submit" className="submit-button">
          {isEditMode ? 'Güncelle' : 'Ekle'}
        </button>
      </form>
      <h3>Mevcut Kullanıcılar</h3>
      <table className="users-table">
        <thead>
          <tr>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Kullanıcı Adı</th>
            <th>Tip</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              <td>{renderUserType(user.type)}</td>
              <td>
                <button onClick={() => handleEditUser(user)} className="edit-button">Düzenle</button>
                <button onClick={() => handleDeleteUser(user.id)} className="delete-button">Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FieldOwnerDashboard;
