import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceTr from "pages/Services/AxiosInstanceTransaction";
import {
  fetchconsigneeId,
  fetchInoteId,
  fetchProjectDetailsId,
  fetchSalesGroupId,
  getLastFiveYr,
  fetchSalesGrpForChart,
  getAllProjectForGraph,
  getAllAccountTypes,
  // getPOdetails,
} from "pages/Services/URLs";
import { fetchIndentId } from "pages/Services/URLs";
import {
  ACCT_TYPE_ID,
  CONSIGNEE_ID,
  FIVE_YEAR_ID,
  I_NOTE,
  PROJECT_DETAILS_GRAPH,
  PROJECT_DETAILS_ID,
  SALES_GROUP_ID,
} from "Redux/Types";
import { INDENTER_ID } from "Redux/Types";
import { SUPPLIER_ID } from "Redux/Types";
import { fetchSupplierId } from "pages/Services/URLs";

export const iNote = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(fetchInoteId);

    dispatch({
      type: I_NOTE,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const indenter = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(fetchIndentId);
    dispatch({
      type: INDENTER_ID,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const supplier = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(fetchSupplierId);
    dispatch({
      type: SUPPLIER_ID,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const consignee = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(fetchconsigneeId);
    dispatch({
      type: CONSIGNEE_ID,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const salesGroup = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(fetchSalesGroupId);
    dispatch({
      type: SALES_GROUP_ID,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getSalesGrpForChart = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(fetchSalesGrpForChart);

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const projectDetails = (orgId, salesGroupId) => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(fetchProjectDetailsId + `${orgId}/${salesGroupId}`);
    dispatch({
      type: PROJECT_DETAILS_ID,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const yearDetails = () => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getLastFiveYr);
    dispatch({
      type: FIVE_YEAR_ID,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const projectDetailsForGraph = () => async (dispatch) => {
  try {
    const res = await axiosInstanceTr.get(getAllProjectForGraph);
    dispatch({
      type: PROJECT_DETAILS_GRAPH,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAccountTypeDetails = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(getAllAccountTypes);
    dispatch({
      type: ACCT_TYPE_ID,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

