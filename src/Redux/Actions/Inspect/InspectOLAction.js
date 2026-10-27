import AxiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";
import {
  getInspectOLUrl,
  getConsigneeBySO,
  getreturnOfferLetter,
  saveQinObsNcFormUrl,
  getQinObsNcFormUrl,
  updateQinObsNcFormUrl,
} from "pages/Services/URLs";
import { toast } from "react-toastify";
import {
  INSPECT_OL,
  CONSIGNEE_BY_SO,
  GET_RETURNED_OL,
} from "../../Types";

export const getInspectOL = () => async (dispatch) => {
  try {
    const res = await AxiosInstanceTransaction.get(getInspectOLUrl);

    dispatch({
      type: INSPECT_OL,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getConsignee = (id) => async (dispatch) => {
  try {
    const res = await AxiosInstanceTransaction.get(getConsigneeBySO + id);
    dispatch({
      type: CONSIGNEE_BY_SO,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getReturnOL = (id) => async (dispatch) => {
  try {
    const res = await AxiosInstanceTransaction.get(getreturnOfferLetter + id);
    dispatch({
      type: GET_RETURNED_OL,
      payload: res.data,
    });
    console.log("rhfgweahtg", res);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getQINdataByOL = (id) => async (dispatch) => {
  try {
    const res = await AxiosInstanceTransaction.get(getQinObsNcFormUrl + id);
    console.log("ghdthydthy", res);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const saveQinObsNcForm = (data) => async () => {
  try {
    const response = await AxiosInstanceTransaction.post(
      saveQinObsNcFormUrl,
      data
    );
    if (response.status === 201) {
      toast.success("Data Successfully Submitted.");
    } else {
      toast.error("Something went wrong. Please try again later");
    }
    const res = response.data;
    return res;
  } catch (error) {
    return "failure";
  }
};
export const updateQinObsNcForm = (data) => async () => {
  try {
    const response = await AxiosInstanceTransaction.post(
      updateQinObsNcFormUrl,
      data
    );
    if (response.status === 201) {
      toast.success("Data Successfully Submitted.");
    }
    // else if (response.status === 201 && res?.id !== 0) {
    //   toast.success("Data Successfully Updated.");
    // }
    else if (response.status !== 201) {
      toast.error("Something went wrong. Please try again later");
    }
    const res = response.data;
    return res;
  } catch (error) {
    return "failure";
  }
};
