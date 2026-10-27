/** @format */

// import axiosInstance from "pages/Services/AxiosInstance";
import { FETCH_PCB } from "Redux/Types";
import { getPcb, savePcb, submitPcb } from "../../../pages/Services/URLs";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";

export const getPCBMain = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getPcb + id);
    dispatch({
      type: FETCH_PCB,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const savePcbFunc = (scmDetails) => async () => {
  try {
    const response = await axiosInstanceTrans.post(savePcb, scmDetails);

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success(
        "Physical Inspection of (PCBs) data saved draft successfully"
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

export const submitPcbFunc = (scmDetails) => async () => {
  try {
    const response = await axiosInstanceTrans.post(submitPcb, scmDetails);

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success("Physical Inspection of (PCBs) data submitted successfully");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};
