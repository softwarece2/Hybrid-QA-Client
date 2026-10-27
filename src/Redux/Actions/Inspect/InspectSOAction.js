import AxiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";

import { getFcmById, getInspectSOUrl } from "pages/Services/URLs";
import { GET_FCM_BY_ID, INSPECT_SO } from "../../Types";

export const getFcm = (id) => async (dispatch) => {
  try {
    const res = await AxiosInstanceTransaction.get(getFcmById + id);
    dispatch({
      type: GET_FCM_BY_ID,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getInspectSO = () => async (dispatch) => {
  try {
    const res = await AxiosInstanceTransaction.get(getInspectSOUrl);

    dispatch({
      type: INSPECT_SO,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
