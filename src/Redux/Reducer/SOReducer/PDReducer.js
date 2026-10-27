import { PROJECT_DETAILS, SELECTED_SO_ID, SELECTED_SO_IN_LI, SELECTED_SO_IN_OL, SELECTED_SO_IN_PD } from "../../Types";

const initialState = {
  projectDetails: [],
  selectedSoInPd: "",
  selectedSoInLi: "",
  selectedSoInOl: {},
  selectedSoIdInOl: "",
};

const PDReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_DETAILS:
      return {
        ...state,
        projectDetails: action.payload,
      };
    case SELECTED_SO_IN_PD:
      return {
        ...state,
        selectedSoInPd: action.payload,
      };
    case SELECTED_SO_IN_LI:
      return {
        ...state,
        selectedSoInLi: action.payload,
      };
    case SELECTED_SO_IN_OL:
      return {
        ...state,
        selectedSoInOl: action.payload,
      };
    case SELECTED_SO_ID:
      return {
        ...state,
        selectedSoIdInOl: action.payload,
      };

    default:
      return state;
  }
};
export default PDReducer;
