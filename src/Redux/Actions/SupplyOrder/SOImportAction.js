import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { saveSOSbuImport } from "../../../pages/Services/URLs";
import { toast } from "react-toastify";

export const saveSOSbuImportDetails = (soDetails, handleClose, setLoading) => async () => {
  try {
    setLoading(true);
    const response = await axiosInstance.post(saveSOSbuImport, soDetails);
    handleClose();
    setLoading(false);
    return response;
  } catch (error) {
    console.log(error.response);
    // toast.error(error.response.data); // Toast message was displaying twice
    throw new Error(error.response.data);
  }
};
