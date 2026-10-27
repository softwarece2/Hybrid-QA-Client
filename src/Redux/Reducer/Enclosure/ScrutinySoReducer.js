import { FETCH_SCRUTINY_SO, VIEW_CHECKLIST_SCRUTINY } from "Redux/Types";

const initialState = {
  scrutinySo: [],
  checklistscrutiny: [],
};

const ScrutinySoReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SCRUTINY_SO:
      return {
        ...state,
        scrutinySo: action.payload,
      };
    case VIEW_CHECKLIST_SCRUTINY:
      return {
        ...state,
        checklistscrutiny: action.payload,
      };

    default:
      return state;
  }
};

export default ScrutinySoReducer;
