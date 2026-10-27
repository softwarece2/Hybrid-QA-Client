import axiosInstance from "pages/Services/AxiosInstance";
import { saveOpa } from "../../../pages/Services/URLs";

export const saveOpaDetails = (opaDetails) => async () => {
  try {
    const response = await axiosInstance.post(saveOpa, opaDetails);

    const res = response;

    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
