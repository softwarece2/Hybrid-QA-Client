
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import {
  AllotSubordinate,
  getAllotedSoForSubordinatesUrl,
  getAllotOlForSubordinateUrl,
  getAllotToOlForSubordinateUrl,
  getjcUrl,
  saveAllotac,
  saveAllotdc,
  saveAllotjc,
  saveOlSubordinatesBydcqaoIdUrl,
  saveSubordinatesBydcqaoIdUrl,
} from "pages/Services/URLs";

import { toast } from "react-toastify";

import { ALLOT_JC } from "Redux/Types";

export const getAllotjc = (roleId, empId) => async dispatch => {
  try {
    const res = await axiosInstanceT.get(getjcUrl + `${roleId}/${empId}`);

    dispatch({
      type: ALLOT_JC,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllotSubordinate = async empId => {
  try {
    const res = await axiosInstanceT.get(getAllotedSoForSubordinatesUrl + empId);

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getOlAllotSubordinate = async (orgId, empId)  => {
  try {
    const res = await axiosInstanceT.get(getAllotToOlForSubordinateUrl + empId);
return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const saveAllotSubordinate = (data ,officerRole) => async () => {
  try {
    const response = await axiosInstanceT.post(saveSubordinatesBydcqaoIdUrl, data);

    const res = response.data;
    if (response.status === 201 && res?.id !== 0) {
      toast.success(`Notification sent to ${officerRole}`);
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
export const saveAllotOlSubordinate = async data => {
  try {
    const response = await axiosInstanceT.post(saveOlSubordinatesBydcqaoIdUrl, data);

    const res = response.data;
    return res;
  } catch (error) {
    console.log(error);
    return Promise.reject("Something went wrong. Please try again later");
  }
};
export const saveAllotDatajc = dcqaoId => async () => {
  try {
    const response = await axiosInstanceT.post(saveAllotjc, dcqaoId);

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

export const saveAllotDatadc = secOfficerId => async () => {
  try {
    const response = await axiosInstanceT.post(saveAllotdc, secOfficerId);

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

export const saveAllotDataac = employeeId => async () => {
  try {
    const response = await axiosInstanceT.post(saveAllotac, employeeId);

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

export const saveAllot = subordinateId => async () => {
  try {
    const response = await axiosInstanceT.post(AllotSubordinate, subordinateId);

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
