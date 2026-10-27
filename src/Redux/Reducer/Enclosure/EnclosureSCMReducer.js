import { FETCH_SCM } from "Redux/Types";

const initialState = {
  inspMain: [],
};

const EnclosureSCMReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SCM:
      return {
        ...state,
        inspMain: action.payload,
      };

    default:
      return state;
  }
};

export default EnclosureSCMReducer;
