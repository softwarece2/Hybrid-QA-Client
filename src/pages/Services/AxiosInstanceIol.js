import axios from "axios";
import { OLMS_IOL_SERVICES } from "../../config.js";

const axiosInstanceIol = axios.create({
  baseURL: OLMS_IOL_SERVICES,
});

axiosInstanceIol.interceptors.request.use((config) => {
  const accessToken = JSON.parse(localStorage.getItem("AccessToken"));
  config.headers.authorization = `Bearer ${accessToken}`;
  return config;
});



export default axiosInstanceIol;
