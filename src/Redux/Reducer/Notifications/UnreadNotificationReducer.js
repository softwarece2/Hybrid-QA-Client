import { UNREAD_NOTIFICATION, UNREAD_NOTIFICATIONSENDER } from "../../Types";

const initialState = {
  unreadNotifications: [],
  unreadNotificationsSender: [],

};

const UnreadNotificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UNREAD_NOTIFICATION:
      return {
        ...state,
        unreadNotifications: action.payload,
      };

    default:
      return state;
  }
};
export default UnreadNotificationsReducer;
export const UnreadNotificationsReducerSender = (state = initialState, action) => {
  switch (action.type) {
    case UNREAD_NOTIFICATIONSENDER:
      return {
        ...state,
        unreadNotificationsSender: action.payload,
      };

    default:
      return state;
  }
};
