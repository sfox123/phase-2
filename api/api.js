import axios from 'axios';

const api = axios.create({
  baseURL:
    'https://56a8-2402-4000-b1c1-e394-29f3-c783-c1e1-ecb1.ngrok-free.app/scope-backend-93b9d/us-central1/app',
  //  baseURL: 'https://us-central1-scope-backend-93b9d.cloudfunctions.net/app',
  headers: {
    'ngrok-skip-browser-warning': '69420',
  },
});

export default api;
