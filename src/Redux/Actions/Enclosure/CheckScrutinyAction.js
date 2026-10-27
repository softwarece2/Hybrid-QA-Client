// import axiosInstance from "pages/Services/AxiosInstance";
import { FETCH_SCRUTINY_SO, VIEW_CHECKLIST_SCRUTINY } from "Redux/Types";
import {
  fetchScrutinySo,
  getCheckScrutiny,
  saveScrutinySoUrl,
  submitScrutinySoUrl,
} from "../../../pages/Services/URLs";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import axiosInstance from "pages/Services/AxiosInstance";

export const getScrutinySo = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(fetchScrutinySo + id);
    dispatch({
      type: FETCH_SCRUTINY_SO,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getCheckScrutinyView = (id) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(getCheckScrutiny);
    dispatch({
      type: VIEW_CHECKLIST_SCRUTINY,
      payload: res.data,
    });
    console.log("egghef", res);
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const saveScrutinySo = (scrutinySoDetails) => async () => {
  try {
    const response = await axiosInstanceTrans.post(
      saveScrutinySoUrl,
      scrutinySoDetails
    );

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success("SO scrutiny draft saved successfully");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const submitScrutinySo = (scrutinySoDetails) => async () => {
  try {
    const response = await axiosInstanceTrans.post(
      submitScrutinySoUrl,
      scrutinySoDetails
    );

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success("Scrutiny SO  Submitted  Successfully  ");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};
