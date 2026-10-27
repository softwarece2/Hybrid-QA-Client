// import { FETCH_FCL_SO } from "Redux/Types";
import {
  getFclSoUrl,
  saveContactUrl,
  submitContactUrl,
} from "../../../pages/Services/URLs";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
// import axiosInstance from "pages/Services/AxiosInstance";

export const getFclSo = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getFclSoUrl + id);
    // dispatch({
    //   type: FETCH_FCL_SO,
    //   payload: res.data,
    // });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const saveFcl = (data) => async () => {
  try {
    const response = await axiosInstanceTrans.post(saveContactUrl, data);

    const res = response.data;
    if (response.status === 201 && res?.id !== 0) {
      toast.success("FCL Data saved successfully.");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return Promise.reject("failure");
  }
};

export const submitFcl = (getValues) => async () => {
  try {
    const response = await axiosInstanceTrans.post(submitContactUrl, getValues);

    const res = response.data;
    if (response.status === 201 && res?.id !== 0) {
      toast.success("FCL Data submitted successfully.");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong. Please try again later");
    return Promise.reject("failure");
  }
};
