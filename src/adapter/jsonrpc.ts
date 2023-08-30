import axios from 'axios';

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_LINEAGE_NODE_URL}/api/v0/json-rpc`,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default instance;