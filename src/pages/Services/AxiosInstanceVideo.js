import { default as axios } from "axios";
import { CV2_IP } from "config.js";

export default axios.create({
  baseURL: CV2_IP,
});
