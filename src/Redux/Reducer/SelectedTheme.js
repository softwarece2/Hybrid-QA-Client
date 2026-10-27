import { PRIMARY_COLOR, SECONDARY_COLOR, RESET_COLOR } from "../Types";

const initialColor = {
  primary: "205375",
  secondary: "B01E68",
};

export const selectedTheme = (state = initialColor, action) => {
  switch (action.type) {
    case PRIMARY_COLOR:
      return { ...state, primary: action.payload };
    case SECONDARY_COLOR:
      return { ...state, secondary: action.payload };
    case RESET_COLOR:
      return initialColor;

    default:
      return state;
  }
};
