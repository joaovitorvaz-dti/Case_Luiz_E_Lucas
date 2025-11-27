import axios from 'axios';
const API_URL = 'http://localhost:5220'; 

export const api = axios.create({
  baseURL: API_URL,
});