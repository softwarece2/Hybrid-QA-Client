import { PREVIOUS_ITEM } from "../Types";
// import OnRefresh from "pages/Notifications/OnRefresh";

export const previousItemReducer = (state = null, action) => {
  switch (action.type) {
    case PREVIOUS_ITEM:
      return action.payload;

    default:
      return state;
  }
};
