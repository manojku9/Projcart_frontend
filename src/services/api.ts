import axios from "axios";

const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  (backendBaseUrl ? `${backendBaseUrl}/api` : "http://localhost:5000/api");

const API = axios.create({
  baseURL: apiBaseUrl
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;
