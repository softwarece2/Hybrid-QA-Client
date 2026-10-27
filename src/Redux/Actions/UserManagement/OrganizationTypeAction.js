import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { getAllOrganizationType } from "../../../pages/Services/URLs";
import { ORG_TYPE } from "Redux/Types";


export const orgtypename = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(getAllOrganizationType);
    dispatch({
      type : ORG_TYPE,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getOrganizationTypeDetails = () => async dispatch => {
  try {
    const res = await axiosInstanceT.get(getAllOrganizationType);

    dispatch({
      type: ORG_TYPE,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
