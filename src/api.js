import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://sahabuldum.com.tr/api' : 'http://localhost:5000/api';

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (user) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id, user) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
export const getDistricts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/districts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
};

export const createDistrict = async (district) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/districts`, district);
    return response.data;
  } catch (error) {
    console.error('Error creating district:', error);
    throw error;
  }
};

export const updateDistrict = async (id, district) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/districts/${id}`, district);
    return response.data;
  } catch (error) {
    console.error('Error updating district:', error);
    throw error;
  }
};

export const deleteDistrict = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/districts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting district:', error);
    throw error;
  }
};

export const getFieldProviders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/field-providers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching field providers:', error);
    throw error;
  }
};

export const getFieldsByOwner = async (ownerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fields`, { params: { ownerId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching fields:', error);
    throw error;
  }
};

export const getFieldSchedule = async (fieldId, startDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schedules`, { params: { fieldId, startDate } });
    return response.data;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

export const updateFieldSchedule = async (schedule) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/schedules`, schedule);
    return response.data;
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
};
export const getFieldProvider = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/field-providers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching field provider:', error);
    throw error;
  }
};

export const createFieldProvider = async (fieldProvider) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/field-providers`, fieldProvider);
    return response.data;
  } catch (error) {
    console.error('Error creating field provider:', error);
    throw error;
  }
};

export const updateFieldProvider = async (id, fieldProvider) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/field-providers/${id}`, fieldProvider);
    return response.data;
  } catch (error) {
    console.error('Error updating field provider:', error);
    throw error;
  }
};

export const getAllFields = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all-fields`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all fields:', error);
    throw error;
  }
};

// Field API calls
export const getFields = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fields`);
    return response.data;
  } catch (error) {
    console.error('Error fetching fields:', error);
    throw error;
  }
};

export const deleteFieldProvider = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/field-providers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting field provider:', error);
    throw error;
  }
};

// Field API calls
export const createField = async (field) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/fields`, field);
    return response.data;
  } catch (error) {
    console.error('Error creating field:', error);
    throw error;
  }
};
export const updateField = async (id, field) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/fields/${id}`, field, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating field:', error);
    throw error;
  }
};


export const deleteField = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/fields/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting field:', error);
    throw error;
  }
};


export const createSchedule = async (schedule) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/schedules`, schedule);
    return response.data;
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};

export const getSchedules = async (fieldId, startDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schedules`, {
      params: { fieldId, startDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
};
export const updateSchedules = async (schedules) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/schedules`, schedules);
    return response.data;
  } catch (error) {
    console.error('Error updating schedules:', error);
    throw error;
  }
};
export const getFieldById = async (fieldId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fields/${fieldId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching field by id:', error);
    throw error;
  }
};


export const updateSchedule = async (id, schedule) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/schedules/${id}`, schedule);
    return response.data;
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
};

export const deleteSchedule = async (fieldId, date, hour) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/schedules`, {
      data: { fieldId, date, hour }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};


