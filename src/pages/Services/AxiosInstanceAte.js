import axios from "axios";
import { OLMS_ATE_SERVICES } from "../../config.js";

const axiosInstanceAte = axios.create({
  baseURL: OLMS_ATE_SERVICES,
});

axiosInstanceAte.interceptors.request.use((config) => {
  const accessToken = JSON.parse(localStorage.getItem("AccessToken"));
  config.headers.authorization = `Bearer ${accessToken}`;
  return config;
});



export default axiosInstanceAte;