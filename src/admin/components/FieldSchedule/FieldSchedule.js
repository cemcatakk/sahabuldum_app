import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Switch from 'react-switch';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Modal, Button, Form } from 'react-bootstrap';
import { getSchedules, updateSchedules, getFieldById, deleteSchedule } from '../../../api';
import './FieldSchedule.css';

const FieldSchedule = () => {
  const { fieldId } = useParams();
  const [fieldName, setFieldName] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState([]);

  const getStartOfWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    start.setDate(diff);
    return start;
  };

  const getDaysOfWeek = (startDate) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const generateHours = (start, end) => {
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    const hoursArray = [];

    if (startHour === 0 && endHour === 0) {
      for (let i = 0; i < 24; i++) {
        hoursArray.push(i);
      }
    } else if (startHour > endHour) {
      for (let i = startHour; i < 24; i++) {
        hoursArray.push(i);
      }
      for (let i = 0; i <= endHour; i++) {
        hoursArray.push(i);
      }
    } else {
      for (let i = startHour; i <= endHour; i++) {
        hoursArray.push(i);
      }
    }
    return hoursArray;
  };

  const fetchSchedules = async (startDate) => {
    try {
      const schedules = await getSchedules(fieldId, startDate.toISOString().split('T')[0]);
      const initialSchedule = getDaysOfWeek(startDate).map((day) => {
        return {
          day,
          slots: hours.map((hour) => {
            const found = schedules.find((s) => new Date(s.date).toDateString() === day.toDateString() && s.hour === hour);
            return {
              hour,
              booked: found ? found.booked : false,
              name: found ? found.name : '',
              phone: found ? found.phone : '',
            };
          }),
        };
      });
      setSchedule(initialSchedule);
    } catch (error) {
      toast.error('Error fetching schedules');
    }
  };

  useEffect(() => {
    const fetchFieldData = async () => {
      try {
        const field = await getFieldById(fieldId);
        setFieldName(field.name);
        const hoursArray = generateHours(field.FieldProvider.availableHoursStart, field.FieldProvider.availableHoursEnd);
        setHours(hoursArray);
      } catch (error) {
        toast.error('Error fetching field data');
      }
    };

    fetchFieldData();
  }, [fieldId]);

  useEffect(() => {
    if (hours.length > 0) {
      fetchSchedules(getStartOfWeek(currentWeek));
    }
  }, [hours, currentWeek]);

  const handleSwitchChange = (dayIndex, hourIndex, booked) => {
    if (booked) {
      setCurrentSlot({ dayIndex, hourIndex });
      setShowModal(true);
    } else {
      handleDeleteSchedule(dayIndex, hourIndex);
    }
  };

  const updateSlot = async (dayIndex, hourIndex, booked, name, phone) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots[hourIndex] = { ...newSchedule[dayIndex].slots[hourIndex], booked, name, phone };
    setSchedule(newSchedule);

    try {
      const updatedSlot = newSchedule[dayIndex].slots[hourIndex];
      await updateSchedules([{
        fieldId,
        date: newSchedule[dayIndex].day.toISOString().split('T')[0],
        hour: updatedSlot.hour,
        booked,
        name,
        phone
      }]);
      toast.success('Schedule updated successfully');
    } catch (error) {
      toast.error('Error updating schedule');
    }
  };

  const handleDeleteSchedule = async (dayIndex, hourIndex) => {
    const newSchedule = [...schedule];
    const slot = newSchedule[dayIndex].slots[hourIndex];

    try {
      await deleteSchedule(fieldId, newSchedule[dayIndex].day.toISOString().split('T')[0], slot.hour);
      slot.booked = false;
      slot.name = '';
      slot.phone = '';
      setSchedule(newSchedule);
      toast.success('Schedule deleted successfully');
    } catch (error) {
      toast.error('Error deleting schedule');
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeek((prevWeek) => {
      const newDate = new Date(prevWeek);
      newDate.setDate(prevWeek.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeek((prevWeek) => {
      const newDate = new Date(prevWeek);
      newDate.setDate(prevWeek.getDate() + 7);
      return newDate;
    });
  };

  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentSlot(null);
  };

  const formatHourRange = (hour) => {
    const nextHour = (hour + 1) % 24;
    return `${String(hour).padStart(2, '0')}:00 - ${String(nextHour).padStart(2, '0')}:00`;
  };

  const handleModalSave = () => {
    if (currentSlot) {
      updateSlot(currentSlot.dayIndex, currentSlot.hourIndex, true, name, phone);
    }
    handleModalClose();
  };

  return (
    <div className="admin-field-schedule">
      <h2>{fieldName} - Rezervasyon Takvimi</h2>
      <div className="admin-date-controls">
        <button onClick={handlePreviousWeek}><FaArrowLeft /></button>
        <span>{formatDate(getStartOfWeek(currentWeek))} - {formatDate(new Date(getStartOfWeek(currentWeek).getTime() + 6 * 24 * 60 * 60 * 1000))}</span>
        <button onClick={handleNextWeek}><FaArrowRight /></button>
      </div>
      <table className="admin-schedule-table">
        <thead>
          <tr>
            <th>Saat</th>
            {schedule.map((day, index) => (
              <th key={index}>{day.day.toLocaleDateString('tr-TR', { weekday: 'long' })} <br /> {formatDate(day.day)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour, hourIndex) => (
            <tr key={hour}>
              <td>{formatHourRange(hour)}</td>
              {schedule.map((day, dayIndex) => (
                <td key={dayIndex}>
                  <div className='admin-hour-cell'>
                    {day.slots[hourIndex].booked && (
                      <div>{day.slots[hourIndex].name}</div>
                    )}
                    <Switch
                      onChange={(booked) => handleSwitchChange(dayIndex, hourIndex, booked)}
                      checked={day.slots[hourIndex].booked}
                    />
                    {day.slots[hourIndex].booked && (
                      <div>{day.slots[hourIndex].phone}</div>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Rezervasyon Bilgileri</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Ad Soyad</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ad Soyad"
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Telefon Numarası</Form.Label>
              <Form.Control
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefon Numarası"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Kapat
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Kaydet
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FieldSchedule;
