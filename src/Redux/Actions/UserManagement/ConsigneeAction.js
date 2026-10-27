import axiosInstance from "pages/Services/AxiosInstance";
import { saveConsignee } from "../../../pages/Services/URLs";
import { updateConsignee } from "../../../pages/Services/URLs";

export const saveConsigneeDetails = (consigneeDetails) => async () => {
  try {
    const response = await axiosInstance.post(saveConsignee, consigneeDetails);

    const res = response;

    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateConsigneeDetails = (consigneeDetails) => async () => {
  try {
    const response = await axiosInstance.post(updateConsignee, consigneeDetails);

    const res = response;
    console.log("testing", res);

    return res;
  } catch (error) {
    return error;
  }
};
