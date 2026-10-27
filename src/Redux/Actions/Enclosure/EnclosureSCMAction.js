/** @format */

// import axiosInstance from "pages/Services/AxiosInstance";
import { FETCH_SCM } from "Redux/Types";
import {
  getSCM,
  savepysicalScm,
  saveScm,
  submitphysicalScm,
} from "../../../pages/Services/URLs";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";

export const getSCMMain = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getSCM + id);
    dispatch({
      type: FETCH_SCM,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const saveScmFunc = (pcbDetails) => async () => {
  try {
    const response = await axiosInstanceTrans.post(saveScm, pcbDetails);

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success(
        "Pysical Inspection of SubItems data Saved draft successfully"
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

export const submitPhysicalScm = (inspPhySubItems) => async () => {
  try {
    const response = await axiosInstanceTrans.post(
      submitphysicalScm,
      inspPhySubItems
    );

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success(
        "Pysical Inspection of SubItems data Submitted successfully"
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

export const savePhysicalScm = (inspPhySubItems) => async () => {
  try {
    const response = await axiosInstanceTrans.post(
      savepysicalScm,
      inspPhySubItems
    );

    const res = response.data;
    if (response.status === 201 && res?.id === 0) {
      toast.success("Data Successfully Submitted.");
    } else if (response.status === 201 && res?.id !== 0) {
      toast.success("Data Successfully Updated.");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};
