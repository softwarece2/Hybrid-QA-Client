import { SELECTED_MENU } from "../Types";

export const selectedMenu = (state = "Home", action) => {
  switch (action.type) {
    case SELECTED_MENU:
      return action.payload;

    default:
      return state;
  }
};
