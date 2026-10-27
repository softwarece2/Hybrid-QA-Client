import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
// import { toast } from "react-toastify";

import { GET_OLWORKLOAD_ASSESMENT } from "Redux/Types";
import {
  getolworkloadUrl,
  inspOlWorkloadSaveUrl,
  inspOlWorkloadSubmitUrl,
  olWorkloadSaveUrl,
  olWorkloadSubmitUrl,
} from "../../../pages/Services/URLs";

export const getOlWorkload = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getolworkloadUrl + id);
    dispatch({
      type: GET_OLWORKLOAD_ASSESMENT,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return Promise.reject("Something went wrong");
  }
};

export const inspOlWorkloadsave = async (value) => {
  return await axiosInstanceTrans
    .post(inspOlWorkloadSaveUrl, value)
    .then((res) => res?.data)
    .catch((err) => {
      console.log("InspSOWorkloadsave error", err);
      return Promise.reject("Something went wrong");
    });
};

export const inspOlWorkloadSubmit = async (value) => {
  return await axiosInstanceTrans
    .post(inspOlWorkloadSubmitUrl, value)
    .then((res) => res?.data)
    .catch((err) => {
      console.log("InspSOWorkloadsave error", err);
      return Promise.reject("Something went wrong");
    });
};

export const olWorkloadSave = async (value) => {
  return await axiosInstanceTrans
    .post(olWorkloadSaveUrl, value)
    .then((res) => res?.data)
    .catch((err) => {
      console.log("InspSOWorkloadsave error", err);
      return Promise.reject("Something went wrong");
    });
};

export const olWorkloadSubmit = async (value) => {
  return await axiosInstanceTrans
    .post(olWorkloadSubmitUrl, value)
    .then((res) => res?.data)
    .catch((err) => {
      console.log("InspSOWorkloadsave error", err);
      return Promise.reject("Something went wrong");
    });
};
