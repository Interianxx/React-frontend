import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/notifications';

class NotificationService {
  getUnreadCount() {
    return axios.get(`${API_URL}/count`, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  getAllNotifications() {
    return axios.get(API_URL, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  createNotification(notification) {
    return axios.post(API_URL, notification, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  markAsRead(id) {
    return axios.put(`${API_URL}/${id}/read`, {}, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  markAllAsRead() {
    return axios.put(`${API_URL}/read-all`, {}, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  deleteNotification(id) {
    return axios.delete(`${API_URL}/${id}`, {
      headers: authHeader(),
      timeout: 5000
    });
  }
}

export default new NotificationService();
