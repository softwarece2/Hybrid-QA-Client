import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { saveAllotacol, saveAllotdcol } from "pages/Services/URLs";

import { toast } from "react-toastify";

export const saveAllotDCOL = (secOfficerId) => async () => {
  try {
    const response = await axiosInstanceT.post(saveAllotdcol, secOfficerId);

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

export const saveAllotACOL = (secOfficerId) => async () => {
  try {
    const response = await axiosInstanceT.post(saveAllotacol, secOfficerId);

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
