import { SUPPLY_ORDER_STATUS } from "Redux/Types";
import { getsupplyorderstatus } from "../../../pages/Services/URLs";
import axiosInstance from "pages/Services/AxiosInstanceRpt";

export const getsupplyOrder = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(getsupplyorderstatus);
    dispatch({
      type: SUPPLY_ORDER_STATUS,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};
