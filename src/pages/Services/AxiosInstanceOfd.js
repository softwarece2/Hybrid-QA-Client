import axios from "axios";
import { OLMS_OFD_SERVICES } from "../../config.js";

const axiosInstanceOfd = axios.create({
  baseURL: OLMS_OFD_SERVICES,
});

axiosInstanceOfd.interceptors.request.use((config) => {
  const accessToken = JSON.parse(localStorage.getItem("AccessToken"));
  config.headers.authorization = `Bearer ${accessToken}`;
  return config;
});



export default axiosInstanceOfd;
