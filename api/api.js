import axios from 'axios';

const api = axios.create({
  // baseURL:
  // 'https://83d3-2402-4000-2080-7885-ccca-36fc-f7bb-6e9b.ngrok-free.app/scope-backend-93b9d/us-central1/app',
  baseURL: 'https://us-central1-scope-backend-93b9d.cloudfunctions.net/app',
  // headers: {
  // 'ngrok-skip-browser-warning': '69420',
  // },
});

export default api;
