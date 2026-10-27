
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { getjcolUrl, saveAllotjcol } from "pages/Services/URLs";

import { toast } from "react-toastify";

import { ALLOT_JC_OL } from "Redux/Types";

export const getAllotoljc = (roleId, empId) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getjcolUrl + `${roleId}/${empId}`);

    dispatch({
      type: ALLOT_JC_OL,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const saveAllotDatajcOl = (dcqaoId) => async () => {
  try {
    const response = await axiosInstanceT.post(saveAllotjcol, dcqaoId);

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
