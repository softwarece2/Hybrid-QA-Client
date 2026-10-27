/** @format */

//import axiosInstance from "pages/Services/AxiosInstance";
import { FETCH_SAVE_INSPECTION_CABLES } from "Redux/Types";
import {
  getbyOlId,
  saveinspcable,
  submitinspcable,
} from "../../../pages/Services/URLs";
import axiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";

export const getInspCables = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTransaction.get(getbyOlId + id);
    dispatch({
      type: FETCH_SAVE_INSPECTION_CABLES,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const submitInspCableMain = (inspCables) => async () => {
  try {
    const response = await axiosInstanceTrans.post(submitinspcable, inspCables);

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success(
        "Checklist for Inspection of Cables data Submitted successfully"
      );
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const saveInspCableMain = (inspCables) => async () => {
  try {
    const response = await axiosInstanceTrans.post(saveinspcable, inspCables);

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success(
        "Checklist for Inspection of Cables data saved draft successfully"
      );
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};
