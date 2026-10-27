// import { LOGGED_IN_USER, USER_LOGOUT, SUPPLY_ORDER_BY_SALES_GROUP } from "../../Types";
import axiosInstance from "pages/Services/AxiosInstance";
import { userLogoutUrl } from "pages/Services/URLs";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export const useUserLogout =  () =>  {
  const dispatch = useDispatch();
   const logout = useCallback(async (payload) => {
    try {
      const response = await axiosInstance.post(userLogoutUrl, payload); 
      toast.success("Logout successfully")

      dispatch({ type: 'USER_LOGOUT' }); 
      dispatch({ type: 'LOGGED_IN_USER', payload: null });
          
      localStorage.clear();
      // dispatch({ type: 'SUPPLY_ORDER_BY_SALES_GROUP', payload: [] });
      
      return response.data; 
    } catch (error) {
      console.error("Logout error:", error); 
    }
  }, []);

  return {logout};
};
