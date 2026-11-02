import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

export const getErrorMessage = (error) => {
  const data = error.response?.data;

  if (data?.errors?.length) {
    return data.errors.map((e) => e.message).join(". ");
  }
  if (data?.message) return data.message;
  if (error.request) return "Cannot reach the server. Is the backend running?";
  return "Something went wrong";
};

export default api;