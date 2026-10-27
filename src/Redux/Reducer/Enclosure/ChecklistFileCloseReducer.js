import { GET_CHECKLIST } from "Redux/Types";

const initialState = {
  getCheckfile: [],
};

const ChecklistFileCloseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHECKLIST:
      return {
        ...state,
        getCheckfile: action.payload,
      };

    default:
      return state;
  }
};
export default ChecklistFileCloseReducer;
