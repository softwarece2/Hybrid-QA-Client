// import { toast } from "react-toastify";
import axiosInstance from "pages/Services/AxiosInstance";
import { changePasswordUrl } from "pages/Services/URLs";

export const updatePassword = (data) => async (dispatch) => {
  try {
    const response = await axiosInstance.post(changePasswordUrl, data);

    const res = response.data;

    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};
