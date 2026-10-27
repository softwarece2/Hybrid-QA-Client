import { LOGIN_TYPE } from "../Types";

export const loginOrSignup = (state = "login", action) => {
  switch (action.type) {
    case LOGIN_TYPE:
      return action.payload;

    default:
      return state;
  }
};
