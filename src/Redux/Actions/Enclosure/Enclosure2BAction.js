import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import { FETCH_SAVED_DETAILS_FCM } from "Redux/Types";
import { getSavedDetailsFCMUrl, savedDetailsFCMUrl, submitDetailsFCMUrl } from "../../../pages/Services/URLs";

export const getSavedDetailsFCM = (id) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(getSavedDetailsFCMUrl + id);
    dispatch({
      type: FETCH_SAVED_DETAILS_FCM,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const submitDetailsFCM = (FcmDetails) => async () => {
  try {
    const response = await axiosInstance.post(submitDetailsFCMUrl, FcmDetails);
    const res = response.data;
    if (response.status === 201 && res?.id !== 0) {
      toast.success("FCM data submitted Successfully");
      return res;
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
  } catch (error) {
    console.log(error);
  }
};

export const saveFcmDetails = (FcmDetails) => async () => {
  try {
    const response = await axiosInstance.post(savedDetailsFCMUrl, FcmDetails);
    const res = response.data;
    if (response.status === 201 && res?.id !== 0) {
      toast.success("FCM data saved Successfully");
      return res;
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
  } catch (error) {
    console.log(error);
  }
};
