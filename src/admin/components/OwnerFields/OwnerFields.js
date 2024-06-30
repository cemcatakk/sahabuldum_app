import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFieldsByOwner } from '../../../api';
import './OwnerFields.css';

const OwnerFields = () => {
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ownerId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (!ownerId) {
      console.error('Owner ID not found in localStorage or sessionStorage');
      return;
    }

    const fetchFields = async () => {
      try {
        const fetchedFields = await getFieldsByOwner(ownerId);
        setFields(fetchedFields);
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };

    fetchFields();
  }, []);

  const handleEditSchedule = (fieldId) => {
    navigate(`/adminpanel/field-schedule/${fieldId}`);
  };

  return (
    <div className="owner-fields">
      <h2>Halı Sahalarım</h2>
      <table className="owner-fields-table">
        <thead>
          <tr>
            <th>İsim</th>
            <th>Şehir</th>
            <th>İlçe</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.id}>
              <td>{field.name}</td>
              <td>{field.FieldProvider.city}</td>
              <td>{field.FieldProvider.district.name}</td>
              <td>
                <button onClick={() => handleEditSchedule(field.id)} className="edit-button">
                  Saatleri Düzenle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerFields;
