import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";

import { GET_SOWORKLOAD_ASSESMENT } from "Redux/Types";
import axiosInstance from "pages/Services/AxiosInstance";
import {
  getAllInspPhaseActivitiesUrl,
  getWorkloadUrl,
  getsoworkloadUrl,
  inspsoworkloadSave,
  inspsoworkloadSubmit,
  soworkloadSave,
  soworkloadSubmit,
} from "../../../pages/Services/URLs";

export const getAllInspPhaseActivities = () => {
  return axiosInstance
    .get(getAllInspPhaseActivitiesUrl)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const getWorkload = async (id) => {
  return await axiosInstanceTrans
    .get(getWorkloadUrl + id)
    .then((res) => res?.data)
    .catch((err) => {
      console.log("getWorkload error", err);
      return Promise.reject("Something went wrong");
    });
};

export const getSOWorkload = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getsoworkloadUrl + id);
    dispatch({
      type: GET_SOWORKLOAD_ASSESMENT,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const InspSOWorkloadsave = async (value) => {
  return await axiosInstanceTrans
    .post(inspsoworkloadSave, value)
    .then((res) => res?.data)
    .catch((err) => {
      console.log("InspSOWorkloadsave error", err);
      return Promise.reject("Something went wrong");
    });
};

export const InspSOWorkloadsubmit = async (value) => {
  return await axiosInstanceTrans
    .post(inspsoworkloadSubmit, value)
    .then((res) => res?.data)
    .catch((err) => {
      console.log("InspSOWorkloadsave error", err);
      return Promise.reject("Something went wrong");
    });
};

export const SOWorkloadsave = async (value) => {
  return await axiosInstanceTrans
    .post(soworkloadSave, value)
    .then((res) => res?.data)
    .catch((err) => {
      console.log("InspSOWorkloadsave error", err);
      return Promise.reject("Something went wrong");
    });
};

export const SOWorkloadsubmit = async (value) => {
  return await axiosInstanceTrans
    .post(soworkloadSubmit, value)
    .then((res) => res?.data)
    .catch((err) => {
      console.log("InspSOWorkloadsave error", err);
      return Promise.reject("Something went wrong");
    });
};
