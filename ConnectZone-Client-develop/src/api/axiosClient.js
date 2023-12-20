import axios from 'axios';

let baseUrl = import.meta.env.VITE_BASE_URL;
const axiosClient = axios.create({
  baseURL: baseUrl,
});

export default axiosClient;
