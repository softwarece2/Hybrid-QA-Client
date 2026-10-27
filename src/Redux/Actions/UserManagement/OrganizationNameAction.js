import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { getAllOrganization } from "../../../pages/Services/URLs";
import { ORG_NAME } from "Redux/Types";

export const orgname = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(getAllOrganization);
    // added active users to the sales group  Modified By:Gopala krishna
    const activeOrgs = res.data ? res.data.filter(org => org.active === true) : [];
    dispatch({
      type: ORG_NAME,
      payload: activeOrgs,
    });

    return activeOrgs;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getOrganizationDetails = () => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getAllOrganization);

    dispatch({
      type: ORG_NAME,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
