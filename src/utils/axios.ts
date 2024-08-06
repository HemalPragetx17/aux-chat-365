import axios from 'axios';

const axiosInstance = axios.create({ baseURL: process.env.HOST_API_KEY });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response;
    if (status === 401) {
      location.reload();
    }
    return Promise.reject(
      (error.response && error.response.data) || 'Something went wrong',
    );
  },
);

export default axiosInstance;
