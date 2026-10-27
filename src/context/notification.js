import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const catCount = {
  count: 0,
  hasLatest: false,
};

const notificationCategoriesInit = {
  SO: catCount,
  OL: catCount,
  OL_ALLOTMENT: catCount,
  SO_ALLOTMENT: catCount,
  WARRANT_ALLOTMENT_TYPE: catCount,
};

const NotificationContext = createContext({ notificationCategories: notificationCategoriesInit, reset() {} });

export function NotificationProvider({ children }) {
  const [notificationCategories, setNotificationCategories] = useState(notificationCategoriesInit);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  function reset() {
    axiosInstance("notification/categoryWiseCount")
      .then(({ data }) => {
        setNotificationCategories(data);
      })
      .catch(console.log);
  }

  useEffect(() => {
    if(loggedInUser){
      reset();
    }
  }, [loggedInUser]);

  return <NotificationContext.Provider value={{ notificationCategories, reset }}>{children}</NotificationContext.Provider>;
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("Please wrap the parent component with Notification Provider");
  }
  return context;
}
