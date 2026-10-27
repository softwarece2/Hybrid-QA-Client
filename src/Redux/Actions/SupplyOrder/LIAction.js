import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import {
  getAdminsBySalesgrpId,
  getAllActiveAppTestBySalesGrpId,
  getExpiryList,
  getLIById,
  getRegById,
  getLiBySale,
  getLineItemObservationId,
  getTestsById,
  saveLITests,
  getLIEditById,
} from "pages/Services/URLs";
import { toast } from "react-toastify";
import { LINE_ITEMS, REG_NO } from "Redux/Types";

export const getLineItemsById = (id,) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getLIById + id);
    dispatch({
      type: LINE_ITEMS,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getRegNoById = (id,serialNos) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getRegById + id + "/serialNos");
    dispatch({
      type: REG_NO,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getEditId =(id) => async() => {
  try {
    const res = await axiosInstanceT.get(getLIEditById + id);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};


export const getOLBySaleOrder = async (id) => {
  try {
    const res = await axiosInstanceT.get(getLiBySale + id);

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getTests = async (id) => {
  try {
    const res = await axiosInstance.get(getAllActiveAppTestBySalesGrpId + id);

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getTestsByLineItemsId = async (id) => {
  try {
    const res = await axiosInstanceT.get(getTestsById + id);

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const saveLineItemTests = (SoData) => async () => {
  try {
    const response = await axiosInstanceT.post(saveLITests, SoData);
    // const res = response.data;
    if (response.status === 201) {
      toast.success("Applicable Test added Successfully.");
    } else {
      toast.error("error");
    }
  } catch (error) {
    console.log(error);
    return "failure";
  }
};


export const getExpiryLists = async (id) => {
  try {
    const res = await axiosInstanceT.get(`${getExpiryList}/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getSalesgrpById = async (id) => {
  return axiosInstance
    .get(getAdminsBySalesgrpId + id)
    .then((res) => res?.data)
    .catch((err) => Promise.reject(err));
};

export const getLineItemObservationIds = async (id) => {
  return axiosInstanceT
    .get(getLineItemObservationId + id)
    .then((res) => res?.data)
    .catch((err) => Promise.reject(err));
};