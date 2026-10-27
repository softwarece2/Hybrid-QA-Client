// import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { getCrossCheckList, getInoteRegister, getListOfFileNos, getOLRegisterByDate, getPORegisterByDate, getSoDetailsByFileNo, saveCrossCheckForm } from "pages/Services/URLs";
import { toast } from "react-toastify";

export const getSupplyOrderRegisterByDate = (orgId, startDate, endDate) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getPORegisterByDate + `?orgId=${orgId}&fromDate=${startDate}&toDate=${endDate}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getOfferLetterRegisterByDate = (orgId, startDate, endDate) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getOLRegisterByDate + `?orgId=${orgId}&fromDate=${startDate}&toDate=${endDate}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getFileNoList = (orgId) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getListOfFileNos + orgId);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
//getCrossCheckList
export const getCrossCheckListByDate = (orgId, startDate, endDate) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getCrossCheckList + `?orgId=${orgId}&fromDate=${startDate}&toDate=${endDate}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getSoDetailsByFile = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getSoDetailsByFileNo + id);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
//saveCrossCheckForm
export const saveCrossCheck = (data) => async () => {
  try {
    const response = await axiosInstanceT.post(saveCrossCheckForm, data);

    // const res = response.data;
    if (response.status === 201) {
      toast.success("Data Successfully Submitted.");
    }
    else {
      toast.error("Something went wrong. Please try again later");
    }
    return response;
  } catch (error) {
    console.log(error);
    return "failure";
  }
};
//getInoteRegister
export const getInoteRegisters = (orgId, startDate, endDate) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getInoteRegister + `?orgId=${orgId}&fromDate=${startDate}&toDate=${endDate}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};