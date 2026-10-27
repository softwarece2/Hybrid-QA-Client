import { FETCH_INSP_FILE_NOTE } from "Redux/Types";

const initialState = {
  inspMain: [],
};

const Enclosure11Reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INSP_FILE_NOTE:
      return {
        ...state,
        inspMain: action.payload,
      };

    default:
      return state;
  }
};

export default Enclosure11Reducer;
