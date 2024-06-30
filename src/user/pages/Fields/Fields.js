import React, { useState } from 'react';
import FieldCard from '../../components/FieldCard/FieldCard';
import './Fields.css';

const fields = [
  {
    id: 1,
    name: 'Halı Saha 1',
    number: '1',
    size: '500m2',
    surface: 'Çim',
    contactname: 'Müşteri 1',
    city: 'İzmir',
    district: 'Konak',
    address: 'Adres 1',
    addressdescription: 'Adres tarifi 1',
    contact1: '1234567890',
    contact2: '0987654321',
    rentalshoes: true,
    rentalgloves: false,
    cafe: true,
    shower: true,
    lockerroom: true,
    availablehoursstart: '09:00',
    availablehoursend: '22:00',
    images: ['image1.jpg', 'image1.jpg'],
    price: 100,
  },
  {
    id: 2,
    name: 'Halı Saha 2',
    number: '1',
    size: '500m2',
    surface: 'Çim',
    contactname: 'Müşteri 1',
    city: 'İzmir',
    district: 'Konak',
    address: 'Adres 1',
    addressdescription: 'Adres tarifi 1',
    contact1: '1234567890',
    contact2: '0987654321',
    rentalshoes: true,
    rentalgloves: false,
    cafe: true,
    shower: true,
    lockerroom: true,
    availablehoursstart: '09:00',
    availablehoursend: '22:00',
    images: ['image1.jpg', 'image1.jpg'],
    price: 150,
  },
  // Diğer sahaları buraya ekleyebilirsiniz.
];

const Fields = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  const districts = [...new Set(fields.map(field => field.district))];

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  const filteredFields = selectedDistrict 
    ? fields.filter(field => field.district === selectedDistrict) 
    : fields;

  return (
    <div className="fields">
      <div className="filter">
İlçe Seçiniz:        <select value={selectedDistrict} onChange={handleDistrictChange}>
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
