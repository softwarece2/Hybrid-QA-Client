import { FETCH_PO_OBSERVATION, FETCH_PO_OBSERVATION_BY_ID } from "Redux/Types";
import { getPoObservationById, getPoObsIds, poObservation, savePoSbuRemarksUrl, savePoSbuUrl, submitPoSbuUrl, submitRemarkPoSbuUrl } from "../../../pages/Services/URLs";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";

export const getPoObservationBySo = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(poObservation + id);
    dispatch({
      type: FETCH_PO_OBSERVATION,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};


export const getPoObservation = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getPoObservationById + id);
    dispatch({
      type: FETCH_PO_OBSERVATION_BY_ID,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};
export const getPoObsTable = (ids) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getPoObsIds+ids);
    dispatch({
      type: FETCH_PO_OBSERVATION_BY_ID,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const savePoSbu = (poObs) => async () => {
  try {
    const response = await axiosInstanceTrans.post(savePoSbuUrl, poObs);

    const res = response.data;
   if (response.status === 201 && res?.id !== 0) {
      toast.success("Po observation remedial action saved Successfully.");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const savePoRemarks = (poObs) => async () => {
  try {
    const response = await axiosInstanceTrans.post(savePoSbuRemarksUrl, poObs);

    const res = response.data;
    if (response.status === 201 && res?.id !== 0) {
      toast.success("Po observation remarks saved Successfully.");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const submitPoSbu = (poObs) => async () => {
  try {
    const response = await axiosInstanceTrans.post(submitPoSbuUrl, poObs);

    const res = response.data;
    if (response.status === 201 && res?.id !== 0) {
      toast.success("PO observation remedial actions submitted Successfully.");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const submitRemarkPo = (poObs) => async () => {
  try {
    const response = await axiosInstanceTrans.post(submitRemarkPoSbuUrl, poObs);

    const res = response.data;
    if (response.status === 201 && res?.id !== 0) {
      toast.success("PO observation remarks submitted Successfully.");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};
