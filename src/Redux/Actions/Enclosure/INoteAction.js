import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import {
  fetchForm4DetailsByOlId,
  fetchGcsLineItems,
  fetchGcsPos,
  fetchINoteDetailsByOlId,
  getClearanceCertificate,
  getInoteByfileNoteId,
  saveClearanceCertificate,
  saveINoteUrl,
  activeSignatoryList,
  getINoteDetailsByOlIdsUrl,
  updateINoteUrl,
} from "pages/Services/URLs";
import { toast } from "react-toastify";
export const getINoteDetailsByOlId = (olId) => {
  return axiosInstanceTrans
    .get(fetchINoteDetailsByOlId + olId)
    .then((res) => res.data)
    .catch((err) => {
      console.log("getINoteDetailsByOlId error", err);
      return Promise.reject(err);
    });
};

export const getINoteDetailsByFnId = (fnId) => {
  return axiosInstanceTrans
    .get(getInoteByfileNoteId + fnId)
    .then((res) => res.data)
    .catch((err) => {
      console.log("getINoteDetailsByOlId error", err);
      return Promise.reject(err);
    });
};

export const getINoteDetailsByOlIds = async (olIds) => {
  try {
    const res = await axiosInstanceTrans.get(getINoteDetailsByOlIdsUrl + olIds);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getINoteSignatoryList = (orgId) => {
  return axiosInstance
    .get(activeSignatoryList + orgId)
    .then((res) => res.data)
    .catch((err) => {
      console.log("getINoteDetailsByOlId error", err);
      return Promise.reject(err);
    });
};

export const getForm4DetailsByOlId = (olId) => {
  return axiosInstanceTrans
    .get(fetchForm4DetailsByOlId + olId)
    .then((res) => res.data)
    .catch((err) => {
      console.log("getForm4DetailsByOlId error", err);
      return Promise.reject(err);
    });
};

export const saveINoteAction = (data) => {
  let url = data.existing ? updateINoteUrl : saveINoteUrl;
  return axiosInstanceTrans
    .post(url, data)
    .then((res) => res.data)
    .catch((err) => {
      return Promise.reject(err);
    });
};
export const saveCc = (data) => async () => {
  try {
    const response = await axiosInstanceTrans.post(saveClearanceCertificate, data);
    const res = response.data;
    if (response.status === 201 && res?.id === 0) {
      toast.success("Data Successfully Submitted.");
    } else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return response;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};
export const getCcByOLId = (olId) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getClearanceCertificate + olId);
    console.log(res, "RES");
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

//fetchGcsPos
export const getGccPos = (salesGrpId) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(fetchGcsPos + salesGrpId);
    console.log(res, "RES");
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getGccPoLineItems = (soId) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(fetchGcsLineItems + soId);
    console.log(res, "RES");
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
