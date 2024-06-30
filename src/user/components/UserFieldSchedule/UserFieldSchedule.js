import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getSchedules, getFieldById } from '../../../api';
import './UserFieldSchedule.css';

const UserFieldSchedule = ({ fieldId }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [hours, setHours] = useState([]);
  const [fieldName, setFieldName] = useState('');

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

  const fetchSchedules = async (fieldId, startDate) => {
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
        const fieldData = await getFieldById(fieldId);
        setFieldName(fieldData.name);
        const hoursArray = generateHours(fieldData.FieldProvider.availableHoursStart, fieldData.FieldProvider.availableHoursEnd);
        setHours(hoursArray);
      } catch (error) {
        toast.error('Error fetching field data');
      }
    };

    fetchFieldData();
  }, [fieldId]);

  useEffect(() => {
    if (hours.length > 0) {
      fetchSchedules(fieldId, getStartOfWeek(currentWeek));
    }
  }, [hours, currentWeek, fieldId]);

  const handlePreviousWeek = () => {
    setCurrentWeek((prevWeek) => new Date(prevWeek.setDate(prevWeek.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setCurrentWeek((prevWeek) => new Date(prevWeek.setDate(prevWeek.getDate() + 7)));
  };

  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatHourRange = (hour) => {
    const nextHour = (hour + 1) % 24;
    return `${String(hour).padStart(2, '0')}:00 - ${String(nextHour).padStart(2, '0')}:00`;
  };

  return (
    <div className="user-field-schedule">
      <div className="date-controls">
        <button onClick={handlePreviousWeek}><FaArrowLeft /></button>
        <span>{formatDate(getStartOfWeek(currentWeek))} - {formatDate(new Date(getStartOfWeek(currentWeek).getTime() + 6 * 24 * 60 * 60 * 1000))}</span>
        <button onClick={handleNextWeek}><FaArrowRight /></button>
      </div>
      <table className="schedule-table">
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
                  {day.slots[hourIndex] && (day.slots[hourIndex].booked ? <FaTimesCircle color="red" /> : <FaCheckCircle color="green" />)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserFieldSchedule;
