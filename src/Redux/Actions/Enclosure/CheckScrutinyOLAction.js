import {
  FETCH_OL_LINE_ITEM_CLR,
  FETCH_SCRUTINY_OL,
  VIEW_SCRUTINY_OL,
} from "Redux/Types";
import {
  saveScrutinyOlUrl,
  submitScrutinyOl,
  fetchScrutinyOl,
  getOlScrutiny,
  fetchOlLineItemClr,
  updateOLLineitemClr,
} from "../../../pages/Services/URLs";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
// import axiosInstanceTr from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import axiosInstance from "pages/Services/AxiosInstance";

export const getScrutinyOl = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(fetchScrutinyOl + id);
    dispatch({
      type: FETCH_SCRUTINY_OL,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getViewScrutinyOl = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(getOlScrutiny);
    dispatch({
      type: VIEW_SCRUTINY_OL,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const saveScrutinyOl = (data) => async () => {
  try {
    const response = await axiosInstanceTrans.post(saveScrutinyOlUrl, data);

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success("Scrutiny OL saved draft successfully");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const submitScrutinyOL = (data) => async () => {
  try {
    const response = await axiosInstanceTrans.post(submitScrutinyOl, data);

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success("Scrutiny OL  Submitted  Successfully  ");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const updateClearedLI = (data) => async () => {
  try {
    const response = await axiosInstanceTrans.post(updateOLLineitemClr, data);
    const res = response.data;
    if (response.status === 200) {
      toast.success("Cleared Line Item Quantity submitted successfully");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const getLineItemClr = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(fetchOlLineItemClr + id);
    dispatch({
      type: FETCH_OL_LINE_ITEM_CLR,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};
