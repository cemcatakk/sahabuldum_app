import React, { useState, useEffect } from 'react';
import FieldCard from '../../components/FieldCard/FieldCard';
import { getAllFields } from '../../../api'; 
import './Home.css';

const Home = () => {
  const [fields, setFields] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const fetchedFields = await getAllFields();
        setFields(fetchedFields);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching fields:', error);
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredFields = fields.filter((field) => {
    return (
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.addressdescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Aramak istediğiniz kelimeyi girin..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="field-list">
        {filteredFields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>
    </div>
  );
};

export default Home;
