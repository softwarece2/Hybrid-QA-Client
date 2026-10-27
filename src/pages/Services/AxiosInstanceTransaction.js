import axios from "axios";
import { TRANSACTION_URL } from "../../config.js";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: TRANSACTION_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = JSON.parse(localStorage.getItem("AccessToken"));
  config.headers.authorization = `Bearer ${accessToken}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error?.response?.status === 401) {
     if(!JSON.parse(sessionStorage.getItem('sessionExpireCount'))){
        toast.info("Your session has expired. Please login again.", {
          position: "bottom-center",
          closeButton: true,
          style: { minWidth: 400 },
        });
        sessionStorage.setItem('sessionExpireCount', true);
      }
      
      localStorage.removeItem('AccessToken');
      localStorage.removeItem("User");
       
        if(window.location.pathname.includes('/layout')){
          setTimeout(() => {
            toast.dismiss();
                window.location.href = '/home';
          }, 2000);
        }
      
    }
      throw error
  }
);

export default axiosInstance;
