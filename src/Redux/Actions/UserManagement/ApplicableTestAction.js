import axiosInstance from "pages/Services/AxiosInstance";
import { saveApplicableTest, updateApplicableTest } from "../../../pages/Services/URLs";

export const saveApplicableTestDetails = (applicableTestDetails) => async () => {
    try {
        const response = await axiosInstance.post(saveApplicableTest, applicableTestDetails);

        const res = response;
        console.log("testing", res);

        return res;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const updateApplicableTestDetails = (applicableTestDetails) => async () => {
    try {
        const response = await axiosInstance.post(updateApplicableTest, applicableTestDetails);

        const res = response;
        console.log("testing", res);

        return res;
    } catch (error) {
        return error;
    }
};
