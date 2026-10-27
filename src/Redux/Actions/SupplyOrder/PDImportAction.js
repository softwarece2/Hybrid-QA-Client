import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import { SELECTED_SO_IN_PD } from "Redux/Types";
import { savePDImport } from "../../../pages/Services/URLs";

export const savePDImportDetails = (req, handleClose, setLoading) => async (dispatch) => {
  try {
    setLoading(true);
    await axiosInstanceT
      .post(savePDImport, req)
      .then((res) => {
        toast.success("Data Submit Successfully");
        handleClose();
        dispatch({
          type: SELECTED_SO_IN_PD,
          payload: req.supplyOrderId,
        });
        setLoading(false);
        return res.data;
      })
      .catch((error) => {
        console.log("savePDImportDetails error", error);
        toast.error(error.response.data);
        setLoading(false);
        return error.response.data;
      });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const savePDImportDetailsReset = () => {
  return {
    type: SELECTED_SO_IN_PD,
    payload: "",
  };
};
