import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { deleteSaleOrder, getPDById } from "pages/Services/URLs";
import { toast } from "react-toastify";
import { PROJECT_DETAILS } from "Redux/Types";
export const getProjectDetailsById = (id) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(getPDById + id);
    dispatch({
      type: PROJECT_DETAILS,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const deleteSaleOrderById =  (id)  => async (dispatch) => {
  try {
    const response = await axiosInstance.get(deleteSaleOrder + id);
    if (response.status === 200) {
      toast.success("Sale Order Details deleted Successfully.");
    }
    else {
      toast.error(response.data);
    }
    return response.data;
  } catch (error) {
    toast.error("Not able to delete the Sale Order Which is present in the Offer Letter");
    return "failure";
  }
};

