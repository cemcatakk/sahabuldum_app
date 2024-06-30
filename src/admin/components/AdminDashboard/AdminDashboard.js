import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFieldProviders, deleteFieldProvider } from '../../../api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [fieldProviders, setFieldProviders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFieldProviders();
        setFieldProviders(data);
      } catch (error) {
        toast.error('Halı saha sağlayıcıları yüklenirken bir hata oluştu.');
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Silmek istediğinize emin misiniz?')) {
      try {
        await deleteFieldProvider(id);
        setFieldProviders(prevProviders => prevProviders.filter(provider => provider.id !== id));
        toast.success('Halı saha sağlayıcısı başarıyla silindi.');
      } catch (error) {
        toast.error('Halı saha sağlayıcısı silinirken bir hata oluştu.');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Halı Saha Sağlayıcıları</h2>
      <Link to="/adminpanel/add-provider" className="add-field-button">Halı Saha Sağlayıcısı Ekle</Link>
      <div className="table-container">
        <table className="providers-table">
          <thead>
            <tr>
              <th>İsim</th>
              <th>Sahibi</th>
              <th>İl</th>
              <th>İlçe</th>
              <th>Adres</th>
              <th>İletişim 1</th>
              <th>İletişim 2</th>
              <th>Ulaşılabilecek Saatler</th>
              <th>Halı Saha Sayısı</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {fieldProviders.map(provider => (
              <tr key={provider.id}>
                <td>{provider.name}</td>
                <td>{provider.customer.firstName} {provider.customer.lastName}</td>
                <td>{provider.city}</td>
                <td>{provider.district.name}</td>
                <td>{provider.address}</td>
                <td>{provider.contact1}</td>
                <td>{provider.contact2}</td>
                <td>{provider.availableHoursStart} - {provider.availableHoursEnd}</td>
                <td>{provider.fields?.length}</td>
                <td>
                  <Link to={`/adminpanel/edit-provider/${provider.id}`} className="action-button"><FaEdit /></Link>
                  <button className="action-button delete-button" onClick={() => handleDelete(provider.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
