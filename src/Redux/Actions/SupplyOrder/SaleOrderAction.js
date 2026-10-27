import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { getAllSaleOrder } from "pages/Services/URLs";
import { SALE_ORDER_LIST } from "Redux/Types";

export const getAllSaleOrderList = () => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getAllSaleOrder);

    dispatch({
      type: SALE_ORDER_LIST,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
