import { FETCH_FILECLOSING_FORM } from "Redux/Types";
import { GET_CHECKLIST } from "Redux/Types";
import { getCheckFileCloseForm, getFileClosingForm } from "pages/Services/URLs";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { submitFileClosingForm } from "pages/Services/URLs";
import { saveFileClosingForm } from "pages/Services/URLs";
import { toast } from "react-toastify";
import axiosInstance from "pages/Services/AxiosInstance";

export const getFileClosingForms = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getFileClosingForm + id);
    dispatch({
      type: FETCH_FILECLOSING_FORM,
      payload: res.data,
    });
    console.log("Checking.... soId", id);
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const submitsFileClosingForm = (data) => async () => {
  try {
    const response = await axiosInstanceTrans.post(submitFileClosingForm, data);

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success("File Closing Form Submitted successfully.");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const savesFileClosingForm = (data) => async () => {
  try {
    const response = await axiosInstanceTrans.post(saveFileClosingForm, data);

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success(" File Closing Form saved successfully.");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const getCheckfile = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(getCheckFileCloseForm);
    dispatch({
      type: GET_CHECKLIST,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
