import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/categories';

class CategoryService {
  getAllCategories() {
    return axios.get(API_URL, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  getCategory(id) {
    return axios.get(`${API_URL}/${id}`, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  createCategory(category) {
    return axios.post(API_URL, category, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  updateCategory(id, category) {
    return axios.put(`${API_URL}/${id}`, category, {
      headers: authHeader(),
      timeout: 5000
    });
  }

  deleteCategory(id) {
    return axios.delete(`${API_URL}/${id}`, {
      headers: authHeader(),
      timeout: 5000
    });
  }
}

export default new CategoryService();