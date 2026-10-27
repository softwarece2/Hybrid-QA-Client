import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { getAllUnreadNotifications, notifyByCategory, updateReadStatusURL,readBy, notifyBySenderCategory, getAllUnreadNotificationsSender } from "pages/Services/URLs";
import { UNREAD_NOTIFICATION, UNREAD_NOTIFICATIONSENDER } from "Redux/Types";

export const getAllUnreadNotify = (empId) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getAllUnreadNotifications + empId);

    dispatch({
      type: UNREAD_NOTIFICATION,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getAllUnreadNotifySender = (empId) => async (dispatch) => {
  try {
    const res = await axiosInstanceT.get(getAllUnreadNotificationsSender + empId);

    dispatch({
      type: UNREAD_NOTIFICATIONSENDER,
      payload: res.data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getCategoryWiseNotify = (category, empId) => {
  return axiosInstanceT
    .get(notifyByCategory + `${category}/${empId}`)
    .then((res) => res.data)
    .catch((error) => {
      console.log("getCategoryWiseNotify error", error);
      return error;
    });
};

export const getCategorySenderWiseNotify = (category, empId) => {
  return axiosInstanceT
    .get(notifyBySenderCategory + `${category}/${empId}`)
    .then((res) => res.data)
    .catch((error) => {
      console.log("getCategoryWiseNotify error", error);
      return error;
    });
};

export const updateReadStatus = (requestBody, category) => {
  axiosInstanceT
    .post(updateReadStatusURL, requestBody)
    .then((res) => {
      getAllUnreadNotify();
      getCategoryWiseNotify(category);
    })
    .catch((error) => console.log("updateReadStatus error", error));
};

export const updateByRead = (notificationId, empId) => {
   return async (dispatch) => { 
    try {
      const response = await axiosInstanceT.post(readBy + `${notificationId}/${empId}`);
      const data = response.data; 
      dispatch({ type: 'UPDATE_BY_READ_SUCCESS', payload: data }); 
 } catch (error) {
      dispatch({ type: 'UPDATE_BY_READ_FAILURE', payload: error.message });
    }
  };
};

