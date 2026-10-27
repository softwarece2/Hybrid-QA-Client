import { FETCH_INSPECTION_MAIN } from "Redux/Types";

const initialState = {
  inspMain: [],
};

const Enclosure9Reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INSPECTION_MAIN:
      return {
        ...state,
        inspMain: action.payload,
      };

    default:
      return state;
  }
};

export default Enclosure9Reducer;
