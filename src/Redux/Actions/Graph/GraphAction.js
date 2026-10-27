import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import axiosInstanceRpt from "pages/Services/AxiosInstanceRpt";

import {
  getByYearWiseData,
  getINoteDetails,
  getINoteGraphDataUrl,
  getINoteGraphForCqao,
  getInoteGraphProjectWiseUrl,
  getInoteGraphYearWiseUrl,
  getINoteValue,
  getOLdetails,
  getOlDetailsGraph,
  getPOdetails,
  getPoDetailsGraph,
  getWorkloadDetailsGraph,
} from "../../../pages/Services/URLs";

export const getPoGraph = async (orgId, consigneeId, indentorId, salesGrpId) => {
  try {
    const res = await axiosInstanceTrans.get(
      getPoDetailsGraph + `?orgId=${orgId}&consigneeId=${consigneeId}&indentorId=${indentorId}&salesGrpId=${salesGrpId}`
      // getPoDetailsGraph + `?orgId=-1&consigneeId=${consigneeId}&indentorId=${indentorId}&salesGrpId=${salesGrpId}`  
      );
    // dispatch({
    //   type: PO_GRAPH,
    //   payload: res.data,
    // });
    return res.data;
  } catch (error) {
    console.log(error);
    return Promise.reject([]);
  }
};

export const getOlGraph = async (orgId, type, val) => {
  try {
    const res = await axiosInstanceTrans.get(
      getOlDetailsGraph + `?orgId=${orgId}&category=${type}&categoryValue=${val}`
      // getOlDetailsGraph + `?orgId=-1&category=${type}&categoryValue=${val}`
    );
    // dispatch({
    //   type: PO_GRAPH,
    //   payload: res.data,
    // });
    return res.data;
  } catch (error) {
    console.log(error);
    return Promise.reject([]);
  }
};

export const getWorkloadGraph = async (startDate, endDate) => {
  try {
    const res = await axiosInstanceRpt.get(getWorkloadDetailsGraph + startDate + `/` + endDate);
    // const res = await axiosInstanceTrans.get(getWorkloadDetailsGraph );
    // dispatch({
    //   type: PO_GRAPH,
    //   payload: res.data,
    // });
    console.log("res", res);
    return res.data;
  } catch (error) {
    console.log(error);
    return Promise.reject([]);
  }
};
export const getInoteGraphYearWise = async (selectedFY, term) => {
  try {
    const res = await axiosInstanceTrans.get(getInoteGraphYearWiseUrl + `?selectedFY=${selectedFY}&term=${term}`);
    // dispatch({
    //   type: PO_GRAPH,
    //   payload: res.data,
    // });
    return res.data;
  } catch (error) {
    console.log(error);
    return Promise.reject([]);
  }
};

export const getInoteGraphProjectWise = async (id) => {
  try {
    const res = await axiosInstanceTrans.get(getInoteGraphProjectWiseUrl + `?projectId=${id}`);
    // dispatch({
    //   type: PO_GRAPH,
    //   payload: res.data,
    // });
    return res.data;
  } catch (error) {
    console.log(error);
    return Promise.reject([]);
  }
};
export const getINoteGraphData = async (selectedFY, id) => {
  try {
    const res = await axiosInstanceRpt.get(getINoteGraphDataUrl + `?selectedFY=${selectedFY}&salesGrpId=${id}`);
    // dispatch({
    //   type: PO_GRAPH,
    //   payload: res.data,
    // });
    return res.data;
  } catch (error) {
    console.log(error);
    return Promise.reject([]);
  }
};
export const getINoteGraphDataForCqao = async (selectedFY, id) => {
  try {
    const res = await axiosInstanceRpt.get(getINoteGraphForCqao + `?selectedFY=${selectedFY}&orgId=${id}`);
    // dispatch({
    //   type: PO_GRAPH,
    //   payload: res.data,
    // });
    return res.data;
  } catch (error) {
    console.log(error);
    return Promise.reject([]);
  }
};

export const getPODetailsForDGQAGraph = () => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getPOdetails);

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getOLDetailsForDGQAGraph = async (orgId, categoryId) => {
  try {
    const res = await axiosInstanceTrans.get(getOLdetails + `?orgId=${orgId}&categoryValue=${categoryId}`);

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
//getINoteDetails
export const getINoteDetailsForDGQAGraph = async (selectedFY, orgId) => {
  try {
    const res = await axiosInstanceTrans.get(getINoteDetails + `?selectedFY=${selectedFY}&orgId=${orgId}`);

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

//getINoteDetails
export const getINoteValuesForDGQAGraph = async (selectedFY, orgId) => {
  try {
    const res = await axiosInstanceTrans.get(getINoteValue + `?selectedFY=${selectedFY}&orgId=${orgId}`);

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
// export const getYearWiseData = async (selectedFY,term) => {
//   try {
//     const res = await axiosInstanceTrans.get(getByYearWiseData  + `?selectedFY=${selectedFY}&term=${term}`);
//     // dispatch({
//     //   type: PO_GRAPH,
//     //   payload: res.data,
//     // });
//     return res.data;
//   } catch (error) {
//     console.log(error);
//     return Promise.reject([]);
//   }
// };