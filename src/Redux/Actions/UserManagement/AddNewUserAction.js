import axiosInstance from "pages/Services/AxiosInstance";
import {
  getAllUsers,
  getAllUsersByOrgTypeId,
  getparentBySeniority,
  getActiveparentBySeniority,
  getUsers,
  saveNewUser,
  updateUserURL,
  updateUserData,
  aolSave,
  getAllAoldetails,
  getAllInspectionAgency,
  getUsersListByOrgTypeId,
} from "pages/Services/URLs";
import { toast } from "react-toastify";
import { USER_TYPES } from "Redux/Types";
import axiosInstanceTr from "pages/Services/AxiosInstanceTransaction";
//getAllUsersByOrgTypeId
export const getUsersByOrgTypeId = (orgTypeId) => async (dispatch) => {
  return axiosInstance
    .get(getAllUsersByOrgTypeId + orgTypeId)
    .then((res) => {
      // res?.data;
      dispatch({
        type: USER_TYPES,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => Promise.reject(err));
};

//getparentBySeniority
export const getParentBySeniorityId = (seniorityId) => async (dispatch) => {
  return axiosInstance
    .get(getparentBySeniority + seniorityId)
    .then((res) => {
      return res.data;
    })
    .catch((err) => Promise.reject(err));
};

export const getActiveParentBySeniorityId =
  (seniorityId) => async (dispatch) => {
    return axiosInstance
      .get(getActiveparentBySeniority + seniorityId)
      .then((res) => {
        return res.data;
      })
      .catch((err) => Promise.reject(err));
  };

//getAllUsers
export const getUsersByOrgId = (orgId) => async (dispatch) => {
  return axiosInstance
    .get(getAllUsers + orgId)
    .then((res) => {
      return res.data;
    })
    .catch((err) => Promise.reject(err));
};

export const saveUser = (data) => async () => {
  try {
    const response = await axiosInstance.post(saveNewUser, data);
    const res = response.data;
    if (response.status === 201) {
      toast.success("Data Successfully Submitted.");

    } 
    return res;
  } catch (error) {
    if (error.response && error.response.data) {
      toast.warning(error.response.data); 
    } 

    else if (error.message) {
      toast.error(error.message);
    } 
    else {
      toast.error("Failed to save user");
    }
    throw error; 
  }
};

export const updateUser = (data) => async () => {
  try {
    const response = await axiosInstance.put(updateUserURL, data);
    const res = response.data;
    toast.success("Data Successfully Updated.");

    return res;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      toast.error("Username already exists!");
    } else {
      toast.error("Failed to Update");
    }
    console.log(error);
    return "failure";
  }
};

export const fetchAllUsers = () => async (dispatch) => {
  return axiosInstance
    .get(getUsers)
    .then((res) => {
      return res.data;
    })
    .catch((err) => Promise.reject(err));
};

export const UpdateUserData = (data) => async () => {
  try {
    const response = await axiosInstance.post(updateUserData, data);
    const res = response.data;
    toast.success("Data Successfully Updated.");

    return res;
    
   } catch (error) {  
      if (error.response && error.response.data) {
        toast.warning(error.response.data.message || error.response.data || "Update Failed");
      } else {
        toast.error("Failed to Update");
      }
    console.log(error);
     throw error; ;
  }
};
//saveAolData
export const saveAolData = (data) => async () => {
  try {
    const response = await axiosInstanceTr.post(aolSave, data);
    const res = response.data;
    toast.success("Data Successfully Updated.");

    return res;
  } catch (error) {
    toast.error("Failed to Update");
    console.log(error);
    return "failure";
  }
};

//getAllAoldetails
export const getAllAoldetailsByOrgId = (orgId) => async (dispatch) => {
  return axiosInstanceTr
    .get(getAllAoldetails + orgId)
    .then((res) => {
      return res.data;
    })
    .catch((err) => Promise.reject(err));
};

export const getInspectionAgencyDetails = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(getAllInspectionAgency);

    // dispatch({
    //   type: INSPECTION_AGENCY,
    //   payload: res.data,
    // });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};


//getAllUsers
export const getListByOrgTypeId = (orgTypeId) => async (dispatch) => {
  return axiosInstance
    .get(getUsersListByOrgTypeId + orgTypeId)
    .then((res) => {
      return res.data;
    })
    .catch((err) => Promise.reject(err));
};
