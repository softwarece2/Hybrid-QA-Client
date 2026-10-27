import { VIEW_SCRUTINY_OL } from "Redux/Types";

const initialState = {
  scrutinySo: [],
  checklistscrutiny: [],
};

const ViewScrutinyReducer = (state = initialState, action) => {
  switch (action.type) {
    case VIEW_SCRUTINY_OL:
      return {
        ...state,
        scrutinySo: action.payload,
      };

    default:
      return state;
  }
};

export default ViewScrutinyReducer;
