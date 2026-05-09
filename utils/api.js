const axios = require("axios");

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((config) => {
  let token = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    token = window.localStorage.getItem("token");
  }
  if (token) config.headers.Authorization = token;
  return config;
});

module.exports = API;
