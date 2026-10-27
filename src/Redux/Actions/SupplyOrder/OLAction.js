import axiosInstanceTr from "pages/Services/AxiosInstanceTransaction";
import axiosInstance from "pages/Services/AxiosInstance";
import {
  getOlBySoId,
  getAllLIbyOLId,
  getOlBySale,
  getOlApprDetailsForINote,
  notifyByOL,
  getLvlOfInspUrl,
  updateOl,
  updateOlStatus,
  getOlAttachments,
  getConcessionByOlId,
  saveConcession,
  updateOlHologramDetails,
  getOLbyStatus,
  getOLCount,
  getOLsBySalesGrpIdUrl,
  getOLCountBySalesGrpIdUrl,
  getAllINotes,
  getNotifiedOLs,
  getInotesBySalesGrpId,
  updateOlDescription,
  updateInoteNo,

  getAllINotesForFirmUrl,
  getAllottedExternalINotesForFirm,
  getAllINotesListByInspOrgId,
  getAllSubSlipListByInspOrgId,
  getExternalInote,
  getAllPassedSubSlipListByInspOrgId
  
} from "pages/Services/URLs";
import { toast } from "react-toastify";
import { LEVEL_OF_INSP } from "Redux/Types";

export const getOfferLetterById = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getOlBySoId + id);
    // dispatch({
    //   type: LINE_ITEMS,
    //   payload: res.data,
    // });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};





export const getLineItemsByOLId = async (id) => {
  try {
    const res = await axiosInstanceTr.get(getAllLIbyOLId + id);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};






export const getLineItemsBySaleOrder = async (id) => {
  try {
    const res = await axiosInstanceTr.get(getOlBySale + id);

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getLvlOfInsp = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(getLvlOfInspUrl);
    dispatch({
      type: LEVEL_OF_INSP,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getOlApprDetails = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getOlApprDetailsForINote + id);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const NotifyCqaeAndJcqaoByOL = (olId, empId) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(notifyByOL + olId + "/" + empId);

    if (res.status === 200) {
      toast.success("Notification sent OIC Admin.");
    } else {
      toast.error("Something went wrong. Please try again later");
    }
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const updateOL = (data) => async () => {
  try {
    const response = await axiosInstanceTr.post(updateOl, data);
    if (response.status === 200) {
      toast.success("Data Successfully Submitted.");
    }
    // else if (response.status === 201 && res?.id !== 0) {
    //   toast.success("Data Successfully Updated.");
    // }
    else {
      toast.error("Something went wrong. Please try again later");
    }
    const res = response.data;
    return res;
  } catch (error) {
    return toast.error(error.response.data);
  }
};

export const updateOLDesp = (data) => async () => {
  try {
    const response = await axiosInstanceTr.post(updateOlDescription, data);
    if (response.status === 200) {
      toast.success("Data Successfully Submitted.");
    }
    // else if (response.status === 201 && res?.id !== 0) {
    //   toast.success("Data Successfully Updated.");
    // }
    else {
      toast.error("Something went wrong. Please try again later");
    }
    const res = response.data;
    return res;
  } catch (error) {
    return "failure";
  }
};

export const updateOlDetailsById = (data) => async () => {
  try {
    const response = await axiosInstanceTr.post(updateOlStatus, data);
    const res = response.data;
    return res;
  } catch (error) {
    return "failure";
  }
};
export const getOlAttachmentsById = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getOlAttachments + id);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getOlConcessionById = (ids) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getConcessionByOlId + ids);
    console.log("jeirer", res);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const saveOLConcession = (data) => async (dispatch) => {
  try {
    const response = await axiosInstanceTr.post(saveConcession, data);
    const res = response.data;
    if (response.status === 201) {
      toast.success("Data Successfully Submitted.");
    } else {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    return "failure";
  }
};

export const updateHologramDetails = (data) => async (dispatch) => {
  try {
    const response = await axiosInstanceTr.post(updateOlHologramDetails, data);
    const res = response.data;
    if (response.status === 201) {
      toast.success("Data Successfully Submitted.");
    } else {
      toast.error("Something went wrong. Please try again later");
    }
    return res;
  } catch (error) {
    return "failure";
  }
};
export const getOlDetails = (orgId, empId) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getOLbyStatus + orgId + "/" + empId);
    return res.data;
  } catch (error) {
    console.log(error);
    return Promise.reject([]);
  }
};
export const getOlDetailsBySalesGrpId = (salesGrpId) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(
      getOLsBySalesGrpIdUrl + `?salesGrpId=${salesGrpId}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return Promise.reject([]);
  }
};

export const getOlStatusCounts = (orgId) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getOLCount + orgId);
    return res.data;
  } catch (error) {
    console.log(error);
    return Promise.reject([]);
  }
};

export const getOLCountBySalesGrpId = (salesGrpId) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(
      getOLCountBySalesGrpIdUrl + salesGrpId
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return Promise.reject([]);
  }
};

export const getAllInotesByFileNoteId = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getAllINotes + id);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getExternalInoteByOrgId = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getExternalInote + id);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllINotesForFirm = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getAllINotesForFirmUrl + id);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getAllAllotedINotesForFirm = (orgId, empId) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getAllottedExternalINotesForFirm + orgId + "/" + empId);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllInotesBySalesGrpId = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getInotesBySalesGrpId + id);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllAllotedINotesForInspOrg = () => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getAllSubSlipListByInspOrgId);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getAllAllotedINotesForInspOrgv2 = () => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getAllPassedSubSlipListByInspOrgId);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};


export const getUsersListByOrgTypeId = "user/getUsers/"


export const getNotifiedOLSById = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getNotifiedOLs + id);
    // dispatch({
    //   type: LINE_ITEMS,
    //   payload: res.data,
    // });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const updateNotenos = (data) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.post(updateInoteNo, data);
    // dispatch({
    //   type: LINE_ITEMS,
    //   payload: res.data,
    // });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
