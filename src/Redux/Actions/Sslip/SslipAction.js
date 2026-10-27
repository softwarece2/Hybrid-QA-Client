import axiosInstanceTr from "pages/Services/AxiosInstanceTransaction";
import axiosInstance from "pages/Services/AxiosInstance";
import {  
    getSslipLineItemsByid
  } from "pages/Services/URLs";


export const getLineItemsBySslipId = async (id) => {
  try {
    const res = await axiosInstanceTr.get(getSslipLineItemsByid + id);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};