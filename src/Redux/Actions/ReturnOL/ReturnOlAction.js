import { RETURN_OL } from "Redux/Types";

import { getByIdROL } from "pages/Services/URLs";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";

export const getReturnOLById = (id) => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(getByIdROL + id);
    dispatch({
      type: RETURN_OL,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
