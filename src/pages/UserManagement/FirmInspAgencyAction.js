import axiosInstance from "pages/Services/AxiosInstance";
import { getAllFirm, getAllInspectionAgency, getAllInspectionAgencyAndFirmDetails, getAllInspectionAgencyOfFirm } from "pages/Services/URLs";

import { FIRM_TYPES, INSPECTION_AGENCY, INSPECTION_AGENCY_OF_FIRM } from "Redux/Types";



export const getFirmDetails = () => async dispatch => {
  try {
    const res = await axiosInstance.get(getAllFirm);
    // added active Firms to the Firm Agency Mapping  Modified By:Gopala krishna
    const activefirms = res.data ? res.data.filter(firm => firm.active === "true") : [];
    dispatch({
      type: FIRM_TYPES,
      payload: activefirms,
    });

    return activefirms;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getInspectionAgencyDetails = () => async dispatch => {
  try {
    const res = await axiosInstance.get(getAllInspectionAgency);
    // added active InspectionAgency to the Firm Agency Mapping  Modified By:Gopala krishna
    const activeInspectionAgency = res.data ? res.data.filter(agency => agency.activeStatus === "true") : [];
    dispatch({
      type: INSPECTION_AGENCY,
      payload: activeInspectionAgency,
    });

    return activeInspectionAgency;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getInspectionAgencyDetailsOfFirm = (id) => async dispatch => {
  try {
    const res = await axiosInstance.get(getAllInspectionAgencyOfFirm + id);

    dispatch({
      type: INSPECTION_AGENCY_OF_FIRM,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getInspectionAgencyDetailsAndFirmDetails = (id) => async dispatch => {
  try {
    const res = await axiosInstance.get(getAllInspectionAgencyAndFirmDetails + id);

    dispatch({
      type: INSPECTION_AGENCY_OF_FIRM,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

