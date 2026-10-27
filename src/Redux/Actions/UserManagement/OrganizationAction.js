import axiosInstance from "pages/Services/AxiosInstance";
import { saveOrganization, updateOrganization } from "../../../pages/Services/URLs";

export const saveOrganizationDetails = (orgDetails) => async () => {
  try {
    const response = await axiosInstance.post(saveOrganization, orgDetails);

    const res = response;

    return res;
  } catch (error) {
    return error;
  }
};

export const updateOrganizationDetails = (orgDetails) => async () => {
  try {
    const response = await axiosInstance.post(
      updateOrganization,
      orgDetails
    );

    const res = response;
    console.log("testing", res);

    return res;
  } catch (error) {
    return error;
  }
};