import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import { SELECTED_SO_IN_OL } from "Redux/Types";
import { saveOLImport } from "../../../pages/Services/URLs";

export const saveOLImportDetails = (req, supplyOrderId, handleClose, setLoading) => async (dispatch) => {
  try {
    setLoading(true);
    await axiosInstanceT
      .post(saveOLImport, req)
      .then((res) => {
        toast.success("Saved Successfully");
        handleClose();
        const olReqData = {
          saleOrderId: req.saleOrderNo,
          supplyOrderId: supplyOrderId,
        };
        dispatch({
          type: SELECTED_SO_IN_OL,
          payload: olReqData,
        });
        setLoading(false);
        return res.data;
      })
      .catch((error) => {
        console.log("saveOLImportDetails error", error);
        toast.error(error.response.data);
        setLoading(false);
        return error.response.data;
      });
    // const response = await axiosInstanceT.post(saveOLImport, req);

    // const res = response.data;

    // toast.success("Saved Successfully");
    // return res;
  } catch (error) {
    console.log(error);
    toast.info(
      error.response.data
      //     {
      //   style: { minWidth: 600 },
      //   position: "bottom-left",
      //   autoClose: false,
      //   closeButton: true,
      // }
    );
    return "failure";
  }
};

export const saveOLImportDetailsReset = () => {
  return {
    type: SELECTED_SO_IN_OL,
    payload: "",
  };
};
