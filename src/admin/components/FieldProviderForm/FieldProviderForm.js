import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Switch from 'react-switch';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFieldProvider, createFieldProvider, updateFieldProvider, createField, updateField, deleteField, getUsers, getDistricts } from '../../../api';
import './FieldProviderForm.css';

const FieldProviderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [provider, setProvider] = useState({
    name: '',
    customerId: '',
    city: 'İzmir',
    districtId: '',
    address: '',
    addressDescription: '',
    contact1: '',
    contact2: '',
    rentalShoes: false,
    rentalGloves: false,
    cafe: false,
    shower: false,
    lockerRoom: false,
    availableHoursStart: '09:00',
    availableHoursEnd: '01:00',
    fields: [],
  });
  const [customers, setCustomers] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCustomers = await getUsers();
        const fetchedDistricts = await getDistricts();
        setCustomers(fetchedCustomers);
        setDistricts(fetchedDistricts);
      } catch (error) {
        toast.error('Müşteriler veya ilçeler yüklenirken bir hata oluştu.');
      }
    };

    fetchData();

    if (id) {
      setIsEdit(true);
      const fetchProvider = async () => {
        try {
          const fetchedProvider = await getFieldProvider(id);
          setProvider(fetchedProvider);
        } catch (error) {
          toast.error('Halı saha sağlayıcısı bilgileri yüklenirken bir hata oluştu.');
        }
      };

      fetchProvider();
    }
  }, [id]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setProvider((prevProvider) => ({ ...prevProvider, [name]: value }));
  };

  const handleSwitchChange = (key, value) => {
    setProvider((prevProvider) => ({ ...prevProvider, [key]: value }));
  };
  const handleFieldSubmit = async (e) => {
    e.preventDefault();
  
    if (!provider.customerId || !provider.districtId) {
      toast.error('Müşteri ve İlçe alanları zorunludur.');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('name', provider.name);
      formData.append('customerId', provider.customerId);
      formData.append('city', provider.city);
      formData.append('districtId', provider.districtId);
      formData.append('address', provider.address);
      formData.append('addressDescription', provider.addressDescription);
      formData.append('contact1', provider.contact1);
      formData.append('contact2', provider.contact2);
      formData.append('rentalShoes', provider.rentalShoes);
      formData.append('rentalGloves', provider.rentalGloves);
      formData.append('cafe', provider.cafe);
      formData.append('shower', provider.shower);
      formData.append('lockerRoom', provider.lockerRoom);
      formData.append('availableHoursStart', provider.availableHoursStart);
      formData.append('availableHoursEnd', provider.availableHoursEnd);
  
      const newFields = provider.fields.filter(field => field.isnew);
      const fields = newFields.map((field, index) => {
        const { id, images, ...rest } = field;
        images.forEach((image) => {
          if (image instanceof File) {
            formData.append('images', image, `${index}_${image.name}`);
          }
        });
        return { ...rest, images: images.map(image => (image instanceof File ? `${index}_${image.name}` : image)) };
      });
  
      formData.append('fields', JSON.stringify(fields));
  
      let savedProvider;
      if (isEdit) {
        savedProvider = await updateFieldProvider(id, formData);
        toast.success('Halı saha sağlayıcısı başarıyla güncellendi.');
      } else {
        savedProvider = await createFieldProvider(formData);
        toast.success('Halı saha sağlayıcısı başarıyla eklendi.');
      }
  
      navigate('/adminpanel');
    } catch (error) {
      toast.error('Bir hata oluştu: ' + error.message);
    }
  };
  
  

  const handleFieldAdd = () => {
    setProvider((prevProvider) => ({
      ...prevProvider,
      fields: [
        ...prevProvider.fields,
        {
          id: Date.now() + Math.random(), 
          name: '',
          size: '',
          surface: '',
          images: [],
          price: '',
          isnew: true
        },
      ],
    }));
  };
  
  const handleFieldDelete = async (fieldId) => {
    if (isEdit && fieldId < 100000) {
      try {
        await deleteField(fieldId);
        setProvider((prevProvider) => ({
          ...prevProvider,
          fields: prevProvider.fields.filter((field) => field.id !== fieldId),
        }));
        toast.success('Halı saha başarıyla silindi.');
      } catch (error) {
        toast.error('Halı saha silinirken bir hata oluştu.');
      }
    } else {
      setProvider((prevProvider) => ({
        ...prevProvider,
        fields: prevProvider.fields.filter((field) => field.id !== fieldId),
      }));
    }
  };
  

  const handleFieldUpdate = (fieldId, updatedField) => {
    setProvider((prevProvider) => ({
      ...prevProvider,
      fields: prevProvider.fields?.map((field) =>
        field.id === fieldId ? updatedField : field
      ),
    }));
  };

  return (
    <div className="provider-form-container">
      <h2>Halı Saha Sağlayıcısı {isEdit ? 'Düzenle' : 'Ekle'}</h2>
      <form onSubmit={handleFieldSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>İsim</label>
            <input type="text" name="name" value={provider.name} onChange={handleFieldChange} required />
          </div>
          <div className="form-group">
            <label>Müşteri</label>
            <select name="customerId" value={provider.customerId} onChange={handleFieldChange} required>
              <option value="" disabled>Müşteri seçin</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>İl</label>
            <input type="text" name="city" value="İzmir" readOnly />
          </div>
          <div className="form-group">
            <label>İlçe</label>
            <select name="districtId" value={provider.districtId} onChange={handleFieldChange} required>
              <option value="" disabled>İlçe seçin</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Adres</label>
            <input type="text" name="address" value={provider.address} onChange={handleFieldChange} required />
          </div>
          <div className="form-group">
            <label>Adres Tarifi</label>
            <input type="text" name="addressDescription" value={provider.addressDescription} onChange={handleFieldChange} />
          </div>
          <div className="form-group">
            <label>İletişim 1</label>
            <input type="text" name="contact1" value={provider.contact1} onChange={handleFieldChange} required />
          </div>
          <div className="form-group">
            <label>İletişim 2</label>
            <input type="text" name="contact2" value={provider.contact2} onChange={handleFieldChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group switch-group">
            <label>
              <Switch onChange={(checked) => handleSwitchChange('rentalShoes', checked)} checked={provider.rentalShoes} />
              Kiralık Krampon
            </label>
            <label>
              <Switch onChange={(checked) => handleSwitchChange('rentalGloves', checked)} checked={provider.rentalGloves} />
              Kiralık Eldiven
            </label>
            <label>
              <Switch onChange={(checked) => handleSwitchChange('cafe', checked)} checked={provider.cafe} />
              Kafe
            </label>
            <label>
              <Switch onChange={(checked) => handleSwitchChange('shower', checked)} checked={provider.shower} />
              Duş
            </label>
            <label>
              <Switch onChange={(checked) => handleSwitchChange('lockerRoom', checked)} checked={provider.lockerRoom} />
              Soyunma Odası
            </label>
          </div>
          <div className="form-group">
            <label>Ulaşılabilecek Saatler</label>
            <div className="hours-container">
              <input type="text" name="availableHoursStart" value={provider.availableHoursStart} onChange={handleFieldChange} />
              <span>-</span>
              <input type="text" name="availableHoursEnd" value={provider.availableHoursEnd} onChange={handleFieldChange} />
            </div>
          </div>
        </div>
      </form>
      <h3>Halı Sahalar</h3>
<button type="button" onClick={handleFieldAdd} className="add-field-button">Halı Saha Ekle</button>
<table className="fields-table">
  <thead>
    <tr>
      <th>İsim</th>
      <th>En</th>
      <th>Boy</th>
      <th>Fiyat</th>
      <th>Resimler</th>
      <th>İşlemler</th>
    </tr>
  </thead>
  <tbody>
    {provider.fields?.map((field) => (
      
      <tr key={field.id || Date.now() + Math.random()}>
        <td>
          <input type="text" value={field.name} onChange={(e) => handleFieldUpdate(field.id, { ...field, name: e.target.value })} disabled={isEdit &&  !field.isnew} />
        </td>
        <td>
          <input type="text" value={field.size} onChange={(e) => handleFieldUpdate(field.id, { ...field, size: e.target.value })} disabled={isEdit && !field.isnew} />
        </td>
        <td>
          <input type="text" value={field.surface} onChange={(e) => handleFieldUpdate(field.id, { ...field, surface: e.target.value })} disabled={isEdit && !field.isnew} />
        </td>
        <td>
          <input type="number" value={field.price} onChange={(e) => handleFieldUpdate(field.id, { ...field, price: e.target.value })} disabled={isEdit && !field.isnew} />
        </td>
        <td>
          {(!isEdit || field.isnew) && (
            <input type="file" multiple onChange={(e) => handleFieldUpdate(field.id, { ...field, images: Array.from(e.target.files) })} />
          )}
          <div className="image-thumbnails">
            {field.images.map((image, index) => (
              <div key={index} className="thumbnail">
                <img 
                  src={typeof image === 'string' ? image : URL.createObjectURL(image)} 
                  alt={`thumbnail-${index}`} 
                />
              </div>
            ))}
          </div>
        </td>
        <td>
          <button onClick={() => handleFieldDelete(field.id)} className="delete-button">Sil</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
<button type="submit" className="submit-button" onClick={handleFieldSubmit}>Kaydet</button>
    </div>
  );
};

export default FieldProviderForm;
