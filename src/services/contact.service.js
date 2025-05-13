import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/contacts';

class ContactService {
  getAllContacts() {
    return axios.get(API_URL, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  getContact(id) {
    return axios.get(`${API_URL}/${id}`, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  createContact(contact) {
    return axios.post(API_URL, contact, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  updateContact(id, contact) {
    return axios.put(`${API_URL}/${id}`, contact, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  deleteContact(id) {
    return axios.delete(`${API_URL}/${id}`, {
      headers: authHeader(),
      timeout: 5000
    });
  }
}

export default new ContactService();
