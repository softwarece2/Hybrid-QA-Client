import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { saveLineImport } from "../../../pages/Services/URLs";
import { toast } from "react-toastify";
import { SELECTED_SO_IN_LI } from "Redux/Types";

export const saveLineImportDetails = (req, handleClose,setLoading) => async (dispatch) => {
  try {
    setLoading(true)
    await axiosInstanceT
      .post(saveLineImport, req)
      .then((res) => {
        toast.success("Line Item Added Successfully");
        handleClose();
        dispatch({
          type: SELECTED_SO_IN_LI,
          payload: req.supplyOrderId,
        });
        setLoading(false)
        return res.data;
      })
      .catch((error) => {
        console.log("saveLIImportDetails error", error);
        toast.error(error.response.data);
        setLoading(false)
        return error.response.data;
      });
      

    // const response = await axiosInstanceT.post(saveLineImport, req);
    // .then((res) => {
    //   // toast.success("Saved Successfully");
    //   return res.data;
    // })
    // .catch((error) => {
    //   console.log("saveLineImportDetails error", error);
    //   // toast.error("Failed to upload!");
    //   return error.response.data;
    // });

    // const res = response.data;

    // return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const saveLineImportDetailsReset = () => {
  return {
    type: SELECTED_SO_IN_LI,
    payload: "",
  };
};
