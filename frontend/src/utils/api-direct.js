// Direct API calls without axios
const API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

const apiDirect = {
  async get(url) {
    try {
      const response = await fetch(`${API_BASE}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('GET error:', error);
      throw error;
    }
  },

  async put(url, data) {
    try {
      const response = await fetch(`${API_BASE}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      return { data: responseData };
    } catch (error) {
      console.error('PUT error:', error);
      throw error;
    }
  },

  async post(url, data) {
    try {
      const response = await fetch(`${API_BASE}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      return { data: responseData };
    } catch (error) {
      console.error('POST error:', error);
      throw error;
    }
  },

  async delete(url) {
    try {
      const response = await fetch(`${API_BASE}${url}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('DELETE error:', error);
      throw error;
    }
  },
};

export default apiDirect;