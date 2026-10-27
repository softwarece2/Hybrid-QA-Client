import axiosInstance from "pages/Services/AxiosInstance";
import { saveIndenter, updateIndenter } from "../../../pages/Services/URLs";

export const saveIndenterDetails = (indenterDetails) => async () => {
  try {
    const response = await axiosInstance.post(saveIndenter, indenterDetails);

    const res = response;

    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateIndenterDetails = (indenterDetails) => async () => {
  try {
    const response = await axiosInstance.post(
      updateIndenter,
      indenterDetails
    );

    const res = response;
    console.log("testing", res);

    return res;
  } catch (error) {
    return error;
  }
};