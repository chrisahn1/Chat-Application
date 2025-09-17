import axios from 'axios';

const baseurl = 'http://localhost:3001';

export default axios.create({
  baseURL: baseurl,
});

export const axiosJWT = axios.create({
  baseURL: baseurl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
