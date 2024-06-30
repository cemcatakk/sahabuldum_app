import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaPhone, FaUser, FaRulerHorizontal, FaHandPaper,  FaLock} from 'react-icons/fa';
import { GiRunningShoe, GiCoffeeCup, GiShower } from 'react-icons/gi';
import { toast } from 'react-toastify';
import { getFieldById } from '../../../api';
import UserFieldSchedule from '../UserFieldSchedule/UserFieldSchedule'; // Import the UserFieldSchedule component
import './FieldCard.css';

const FieldCard = ({ field }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [fieldName, setFieldName] = useState('');

  useEffect(() => {
    const fetchFieldData = async () => {
      try {
        const fieldData = await getFieldById(field.id);
        setFieldName(fieldData.name);
      } catch (error) {
        toast.error('Error fetching field data');
      }
    };

    fetchFieldData();
  }, [field]);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const openGoogleMaps = () => {
    if (field.latitude && field.longitude) {
      const url = `https://www.google.com/maps?q=${field.FieldProvider.latitude},${field.FieldProvider.longitude}`;
      window.open(url, '_blank');
    }
  };

  const featureIcons = {
    rentalShoes: <GiRunningShoe />,
    rentalGloves: <FaHandPaper />,
    cafe: <GiCoffeeCup />,
    shower: <GiShower />,
    lockerRoom: <FaLock />
  };

  return (
    <div className="field-card">
      <div className="field-images">
        <div className="field-main-image">
          <img src={field.images[selectedImageIndex]} alt={`${field.name} ${selectedImageIndex + 1}`} />
        </div>
        <div className="field-thumbnails">
          {field.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${field.name} ${index + 1}`}
              className={selectedImageIndex === index ? 'selected' : ''}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
      </div>
      <div className="field-details">
        <div className="field-info">
          <h2><FaMapMarkerAlt /> {field.FieldProvider.district.name} - {field.name}</h2>
        </div>
        <div className="field-features">
          <h3>Özellikler</h3>
          <p><FaRulerHorizontal /> Saha Ölçüleri(En-Boy): <strong>{field.size}x{field.surface}m</strong></p>
          {Object.keys(featureIcons).map((key) => (
            <p key={key}>
              <span className="feature-icon">{featureIcons[key]}</span> {key === 'rentalShoes' && 'Kiralık Ayakkabılar'}
              {key === 'rentalGloves' && 'Kiralık Eldiven'}
              {key === 'cafe' && 'Kafe'}
              {key === 'shower' && 'Duş'}
              {key === 'lockerRoom' && 'Soyunma Odası'}
              <span className="status-icon">
                {field.FieldProvider[key] ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />}
              </span>
            </p>
          ))}
        </div>
        <div className="field-contact">
          <h3>İletişim</h3>
          {field.FieldProvider.name && <p><FaUser /> <strong>İsim:</strong> {field.FieldProvider.name}</p>}
          {field.FieldProvider.contact1 && <p><FaPhone /> <strong>Tel 1:</strong> <a href={`tel:${field.FieldProvider.contact1}`}>{field.FieldProvider.contact1}</a></p>}
          {field.FieldProvider.contact2 && <p><FaPhone /> <strong>Tel 2:</strong> <a href={`tel:${field.FieldProvider.contact2}`}>{field.FieldProvider.contact2}</a></p>}
          <div className="field-address">
            <p onClick={openGoogleMaps}><FaMapMarkerAlt style={{ cursor: 'pointer' }} /> {field.FieldProvider.address}</p>
            {field.FieldProvider.addressDescription && <p>{field.FieldProvider.addressDescription}</p>}
          </div>
        </div>
      </div>
      <div className="field-schedule">
        <UserFieldSchedule fieldId={field.id} />
      </div>
    </div>
  );
};

export default FieldCard;
