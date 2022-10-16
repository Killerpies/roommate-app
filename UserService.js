import axios from 'axios';

// the single Axios instance we use for calls
const apiClient = axios.create({
  //baseURL: 'http://localhost:5000',
  baseURL: process.env.DATABASE_URL, // with ssl?
  withCredentials: false, // this is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default {
  /* with pagination */
  getUsers() {
    // console.log(process.env.DATABASE_URL);
    return apiClient.get('/users');
  },
};