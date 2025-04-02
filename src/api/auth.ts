import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Replace with your backend URL

export const login = async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/signin`, { username, password });
    return response.data;
  };
  
export const refreshTokens = async (userId: string) => {
    const response = await axios.post(`${API_URL}/auth/refresh`, { userId });
    return response.data;
};

export const register = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/signup`, { username, password });
  return response.data;
};

export const fetchPosts = async (accessToken: string) => {
  const response = await axios.get(`${API_URL}/posts`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const logout = async (accessToken: string) => {
  await axios.post(
    `${API_URL}/auth/logout`,
    {},
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};