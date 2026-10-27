import { FETCH_ISIB } from "Redux/Types";

const initialState = {
  inspMain: [],
};

const EnclosureISIBReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ISIB:
      return {
        ...state,
        inspMain: action.payload,
      };

    default:
      return state;
  }
};

export default EnclosureISIBReducer;
