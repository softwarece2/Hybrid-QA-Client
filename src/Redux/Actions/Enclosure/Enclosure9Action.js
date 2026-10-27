/** @format */

// import axiosInstance from "pages/Services/AxiosInstance";
import { FETCH_INSPECTION_MAIN } from "Redux/Types";
import {
  getInspEleMain,
  getTestValues,
  saveInspEleUrl,
  submitInspEleUrl,
} from "../../../pages/Services/URLs";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";

export const getInspectionMain = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getInspEleMain + id);
    dispatch({
      type: FETCH_INSPECTION_MAIN,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const saveInspectionMain = (inspElecDetails) => async () => {
  try {
    const response = await axiosInstanceTrans.post(
      saveInspEleUrl,
      inspElecDetails
    );

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success(
        "Electrical Inspection of Main /Integrated System data saved draft successfully"
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
export const submitInspectionMain = (inspElecDetails) => async () => {
  try {
    const response = await axiosInstanceTrans.post(
      submitInspEleUrl,
      inspElecDetails
    );

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success(
        "Electrical Inspection of Main /Integrated System data Submitted successfully"
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


export async function  getAllTestValues ()  {

  return  await axiosInstanceTrans.get(getTestValues);

};