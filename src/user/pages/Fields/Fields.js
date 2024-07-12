import React, { useState, useEffect } from 'react';
import FieldCard from '../../components/FieldCard/FieldCard';
import { getAllFields } from '../../../api'; 
import './Fields.css';
import { Helmet } from 'react-helmet';

const Fields = () => {
  const [fields, setFields] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
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

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  const districts = [...new Set(fields.map(field => field.FieldProvider.district.name))];

  const filteredFields = selectedDistrict 
    ? fields.filter(field => field.FieldProvider.district.name === selectedDistrict) 
    : fields;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fields">
      <Helmet>
        <title>Sahalarımız | Sahabuldum</title>
        <meta name="description" content="Sahabuldum'daki tüm halı sahaları keşfedin. İzmir ve çevresindeki halı sahaları filtreleyerek arayın ve kiralayın." />
      </Helmet>
      <div className="filter">
        İlçe Seçiniz: 
        <select value={selectedDistrict} onChange={handleDistrictChange}>
          <option value="">Tüm İlçeler</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>
      <div className="field-list">
        {filteredFields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>
    </div>
  );
};

export default Fields;
