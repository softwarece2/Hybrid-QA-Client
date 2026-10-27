import axiosInstance from "pages/Services/AxiosInstance";
import { saveItemCategory, updateItemCategory } from "../../../pages/Services/URLs";

export const saveItemCategoryDetails = (itemCategoryDetails) => async () => {
    try {
        const response = await axiosInstance.post(saveItemCategory, itemCategoryDetails);

        const res = response;
        console.log("testing", res);

        return res;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const updateItemCategoryDetails = (itemCategoryDetails) => async () => {
    try {
        const response = await axiosInstance.post(updateItemCategory, itemCategoryDetails);

        const res = response;
        console.log("testing", res);

        return res;
    } catch (error) {
        return error;
    }
};
