import { LOGGED_IN_USER } from "../Types";

export const loggedInUser = (state = null, action) => {
  switch (action.type) {
    case LOGGED_IN_USER:
      return action.payload;

    default:
      return state;
  }
};
