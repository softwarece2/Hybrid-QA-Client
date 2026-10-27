/** @format */

// import axiosInstance from "pages/Services/AxiosInstance";
import { FETCH_ISIB } from "Redux/Types";

import {
  getIsIb,
  saveISIBUrl,
  submitISIBUrl,
} from "../../../pages/Services/URLs";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
// import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";

export const getISIBMain = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getIsIb + id);
    dispatch({
      type: FETCH_ISIB,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const saveISIBMain = (inspISIBDetails) => async () => {
  try {
    const response = await axiosInstanceTrans.post(
      saveISIBUrl,
      inspISIBDetails
    );

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success("Physical Inspection (ISIB) data saved draft successfully");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const submitISIBMain = (ISIB) => async () => {
  try {
    const response = await axiosInstanceTrans.post(submitISIBUrl, ISIB);

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success("Physical Inspection (ISIB) data submitted successfully");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};
