import { RETURN_OL } from "Redux/Types";

const initialState = {
  inspMain: [],
};

const ReturnOLReducer = (state = initialState, action) => {
  switch (action.type) {
    case RETURN_OL:
      return {
        ...state,
        inspMain: action.payload,
      };

    default:
      return state;
  }
};

export default ReturnOLReducer;