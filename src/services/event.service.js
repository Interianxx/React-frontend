import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/events';

class EventService {
  getAllEvents() {
    return axios.get(API_URL, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  getEvent(id) {
    return axios.get(`${API_URL}/${id}`, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  createEvent(event) {
    return axios.post(API_URL, event, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  updateEvent(id, event) {
    return axios.put(`${API_URL}/${id}`, event, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  deleteEvent(id) {
    return axios.delete(`${API_URL}/${id}`, {
      headers: authHeader(),
      timeout: 5000
    });
  }
}

export default new EventService();