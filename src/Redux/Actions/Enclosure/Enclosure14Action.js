/** @format */

import { FETCH_SPARES, INSP_PDI_MAIN } from "Redux/Types";

import {
  getInspPdiSparesIb,
  getpdiMain,
  saveInspPdiSparesIb,
  savePdiMain,
  submitInspPdiSparesIb,
  submitPdiMain,
} from "../../../pages/Services/URLs";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
// import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";

export const getInspPdiSpares = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getInspPdiSparesIb + id);
    dispatch({
      type: FETCH_SPARES,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};
export const getInspPdiMain = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getpdiMain + id);
    dispatch({
      type: INSP_PDI_MAIN,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const saveInspPdiSpares = (inspPdiSparesIb) => async () => {
  try {
    const response = await axiosInstanceTrans.post(
      saveInspPdiSparesIb,
      inspPdiSparesIb
    );

    const res = response.data;
    if (response.status === 201 && res?.id === 0) {
      toast.success(
        "Pre dispatch inspection of Main System saved draft successfully."
      );
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

export const submitInspPdiSpares = (inspPdiSparesIb) => async () => {
  try {
    const response = await axiosInstanceTrans.post(
      submitInspPdiSparesIb,
      inspPdiSparesIb
    );

    const res = response.data;
    if (response.status === 201 && res?.id === 0) {
      toast.success(
        "Checklist for Pre dispatch inspection of Main System submitted successfully."
      );
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

export const submitInspPdiMain = (inspPdiMain) => async () => {
  try {
    const response = await axiosInstanceTrans.post(submitPdiMain, inspPdiMain);

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success(
        "Checklist for Pre dispatch inspection of Main System submitted successfully"
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

export const saveInspPdiMain = (inspPdiMain) => async () => {
  try {
    const response = await axiosInstanceTrans.post(savePdiMain, inspPdiMain);

    const res = response.data;
    if (response.status === 201 && res?.id !== null && res?.id !== 0) {
      toast.success("Checklist for Pre dispatch saved draft successfully");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};
