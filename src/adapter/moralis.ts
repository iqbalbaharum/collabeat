import axios from 'axios';

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_MORALIS_URL}`,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': `${import.meta.env.VITE_MORALIS_API_KEY}` 
  }
});

export default instance;