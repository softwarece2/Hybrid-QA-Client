import axiosInstance from "pages/Services/AxiosInstance";
import { saveUom, updateUom } from "../../../pages/Services/URLs";

export const saveUomDetails = (uomDetails) => async () => {
    try {
        const response = await axiosInstance.post(saveUom, uomDetails);

        const res = response;
        console.log("testing", res);

        return res;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const updateUomDetails = (uomDetails) => async () => {
    try {
        const response = await axiosInstance.post(updateUom, uomDetails);

        const res = response;
        console.log("testing", res);

        return res;
    } catch (error) {
        return error;
    }
};
