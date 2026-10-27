import axiosInstance from "pages/Services/AxiosInstance";
import { saveSupplier, updateSupplier } from "../../../pages/Services/URLs";

export const saveSupplierDetails = (supplierDetails) => async () => {
  try {
    const response = await axiosInstance.post(saveSupplier, supplierDetails);

    const res = response;

    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateSupplierDetails = (supplierDetails) => async () => {
  try {
    const response = await axiosInstance.post(updateSupplier, supplierDetails);

    const res = response;
    console.log("testing", res);

    return res;
  } catch (error) {
    return error;
  }
};
