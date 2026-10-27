import axiosInstance from "pages/Services/AxiosInstance";
import { saveFirmAgency, saveSalesgroup, updateSalesGroup } from "../../../pages/Services/URLs";
import { updateFirmAgency } from "../../../pages/Services/URLs";

export const saveSalesGroupDetails = (salesGroupDetails) => async () => {
  try {
    const response = await axiosInstance.post(
      saveSalesgroup,
      salesGroupDetails
    );

    const res = response;
    console.log("testing", res);

    return res;
  } catch (error) {
    return error;
  }
};


//updateSalesGroup
export const updateSalesGroupDetails = (salesGroupDetails) => async () => {
  try {
    const response = await axiosInstance.post(
      updateSalesGroup,
      salesGroupDetails
    );

    const res = response;
    console.log("testing", res);

    return res;
  } catch (error) {
    return error;
  }
};

export const saveFirmAgencyDetails = (firmAgencyDetails) => async () => {
  try {
    const response = await axiosInstance.post(
      saveFirmAgency,
      firmAgencyDetails
    );

    const res = response;
    console.log("testing", res);

    return res;
  } catch (error) {
    return error;
  }
};

export const updateFirmAgencyDetails = (firmAgencyDetails) => async () => {
  try {
    const response = await axiosInstance.put(
      updateFirmAgency,
      firmAgencyDetails
    );

    const res = response;
    console.log("testing", res);

    return res;
  } catch (error) {
    return error;
  }
};