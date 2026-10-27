import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import {
  deleteSO,
  getAllSO,
  getAllSaleOrders,
  getAllInspectors,
  fetchSoByOrgId,
  saveAllot,
  getById,
  getALLOL,
  saveAllotOL,
  saveSupplyOrder,
  saveDdExtn,
  getILBySoId,
  saveIL,
  // getDdBySO,
  jcqaoNotifyBySo,
  getAllByOL,
  saveAL,
  getALBySO,
  getAllSOById,
  getPDbyId,
  notifyBySo,
  getAllotedSupplyOrderDetailsUrl,
  fetchSoByOrgIdOptimized,
  getAllSOBySalesGrpOptimizedUrl,
  getSoAttachmentsUrl,
  getLIdetailsByOLIDs,
  fetchExpiringOrdersByOrgId,
  getAllSubmittedSOsById,
  getWarranNotify,
} from "pages/Services/URLs";
import { toast } from "react-toastify";
import {
  SUPPLY_ORDER,
  SALE_ORDER,
  INSPECT_INSPECTOR,
  FETCH_SO_BY_ORG_ID,
  SUPPLY_ORDER_ID,
  OFFER_LETTERS,
  ITEM_LOTS_BY_SO_ID,
  // DD_BY_SO_ID,
  INSPECT_BY_SO_ID,
  AMENDMENT_BY_SO_ID,
  SUPPLY_ORDER_BY_SALES_GROUP,
} from "Redux/Types";

export const getAllSupplyOrder = () => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getAllSO);

    dispatch({
      type: SUPPLY_ORDER,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllSaleOrderDetails = (soId) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getAllSaleOrders + soId);

    dispatch({
      type: SALE_ORDER,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getAllSOBySalesGrp = (empId) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getAllSOById + empId);

    dispatch({
      type: SUPPLY_ORDER_BY_SALES_GROUP,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllSupplyOrdersBySalesGrpOptimized = async (empId) => {
  return axiosInstanceT
    .get(getAllSOBySalesGrpOptimizedUrl + empId)
    .then((res) => res?.data)
    .catch((err) => Promise.reject(err));
};

export const getSoAttachments = async (soId) => {
  return axiosInstanceT
    .get(getSoAttachmentsUrl + soId)
    .then((res) => res?.data)
    .catch((err) => Promise.reject(err));
};

export const getSupplyOrderByOrgId = (orgId) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(fetchSoByOrgId + orgId);

    dispatch({
      type: FETCH_SO_BY_ORG_ID,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getSupplyOrderByOrgIdOptimized = async (orgId) => {
  return axiosInstanceT
    .get(fetchSoByOrgIdOptimized + orgId)
    .then((res) => res?.data)
    .catch((err) => Promise.reject(err));
};
export const getSOByOrgIdOptimized = (orgId) => async (dispatch) => {
  return axiosInstanceT
    .get(fetchSoByOrgIdOptimized + orgId)
    .then((res) => {
      // res?.data;
      dispatch({
        type: FETCH_SO_BY_ORG_ID,
        payload: res.data,
      });
    })
    .catch((err) => Promise.reject(err));
};

export const getAllotedSupplyOrderDetails = async (empId) => {
  return axiosInstanceT
    .get(getAllotedSupplyOrderDetailsUrl + empId)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const deleteSupplyOrder = (id) => async (dispatch) => {
  console.log("oooo", id);
  try {
    const res = await axiosInstanceT.get(deleteSO + id);

    console.log("deleteSO", res);

    if (res.data === "success") {
      toast.success("Supply Order Deleted Successfully");
    } else {
      toast.error("Failed to delete Supply Order");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getInspectors = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(getAllInspectors);

    dispatch({
      type: INSPECT_INSPECTOR,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const saveAllotData = (AllotData) => async () => {
  try {
    const response = await axiosInstanceT.post(saveAllot, AllotData);

    const res = response.data;
    if (response.status === 201 && res?.id === 0) {
      toast.success("Data Successfully Submitted.");
    }
    // else if (response.status === 201 && res?.id !== 0) {
    //   toast.success("Data Successfully Updated.");
    // }
    else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return response;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const saveAllotDataOL = (AllotData) => async () => {
  try {
    const response = await axiosInstanceT.post(saveAllotOL, AllotData);

    const res = response.data;
    if (response.status === 201 && res?.id === 0) {
      toast.success("Data Successfully Submitted.");
    }
    // else if (response.status === 201 && res?.id !== 0) {
    //   toast.success("Data Successfully Updated.");
    // }
    else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    return response;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const getSupplyOrderById = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getById + id);
    dispatch({
      type: SUPPLY_ORDER_ID,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllOfferLetters = (orgId) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getALLOL + orgId);
    dispatch({
      type: OFFER_LETTERS,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const saveSupplyOrderData = (SoData) => async () => {
  try {
    const response = await axiosInstanceT.post(saveSupplyOrder, SoData);
    // const res = response.data;
    if (response.status === 202) {
      toast.success("SO/PO details successfully submitted.");
    } else {
      toast.error("error");
    }
  } catch (error) {
    console.log(error);
    const errorMessage = error.response?.data ? error.response.data : "Failed to Submit Details.";
    toast.error(errorMessage);
    return "failure";
  }
};
export const saveDdExtensionData = (DdData) => async () => {
  try {
    const response = await axiosInstanceT.post(saveDdExtn, DdData);
    // const res = response.data;
    if (response.status === 201) {
      toast.success("DD Extension Successfully Submitted.");
    } else {
      toast.error("error");
    }
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const saveAmendmentsData = (AData) => async () => {
  try {
    const response = await axiosInstanceT.post(saveAL, AData);
    // const res = response.data;
    if (response.status === 201) {
      toast.success("Amendments Successfully Submitted.");
    } else {
      toast.error("error");
    }
  } catch (error) {
    console.log(error);
    return "failure";
  }
};
export const getDdDetails = (AId) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getALBySO + AId);
    console.log("this is action", res.data);

    dispatch({
      type: AMENDMENT_BY_SO_ID,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getILDetails = (soId) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getILBySoId + soId);
    console.log("this is action", res.data);
    dispatch({
      type: ITEM_LOTS_BY_SO_ID,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const saveILData = (OLData) => async () => {
  try {
    const response = await axiosInstanceT.post(saveIL, OLData);
    // const res = response.data;
    if (response.status === 201) {
      toast.success("Item Lots Successfully Submitted.");
    } else {
      toast.error("error");
    }
  } catch (error) {
    console.log(error);
    return "failure";
  }
};

export const getAlInspectOL = (olId) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getAllByOL + olId);
    console.log("rfherhf", olId);
    dispatch({
      type: INSPECT_BY_SO_ID,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const notifyJcqao = (Data) => async () => {
  try {
    const response = await axiosInstanceT.post(jcqaoNotifyBySo, Data);

    if (response.status === 201) {
      toast.success("Supply Order notification sent to Inspector");
    } else {
      toast.error("error");
    }
  } catch (error) {
    console.log(error);
    return "failure";
  }
};
export const getProjectDetails = (soId, empId) => async (dispatch) => {
  try {
    const response = await axiosInstanceT.get(getPDbyId + soId + "/" + empId);
    const res = response.data;
    console.log("saehgwu", res);
    //  dispatch({
    //    type: INSPECT_BY_SO_ID,
    //    payload: res.data,
    //  });
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const NotifyCqaeAndJcqao = (req) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.post(notifyBySo, req);
    if (res.status === 200) {
      toast.success("Notification sent successfully");
    } else {
      toast.error("Something went wrong. Please try again later");
    }
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getWarranNotifys = (req) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.post(getWarranNotify, req);
    if (res.status === 201 || res.status === 200) {
      toast.success("Notification sent successfully");
    } else {
      toast.error("Something went wrong. Please try again later");
    }
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getLIdetails = (olIds) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getLIdetailsByOLIDs + olIds);
    //console.log("rfherhf", olId);
    dispatch({
      type: INSPECT_BY_SO_ID,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getListExpiringOrdersByOrgId = async (orgId) => {
  try {
    const res = await axiosInstanceT.get(`${fetchExpiringOrdersByOrgId}/${orgId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllSubmittedSOByempId = (empId) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getAllSubmittedSOsById + empId);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
