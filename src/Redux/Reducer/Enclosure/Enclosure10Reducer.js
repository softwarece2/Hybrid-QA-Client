import { FETCH_SAVE_INSPECTION_CABLES } from "Redux/Types";

const initialState = {
  savedInspecCable: [],
};

const Enclosure10Reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SAVE_INSPECTION_CABLES:
      return {
        ...state,
        savedInspecCable: action.payload,
      };

    default:
      return state;
  }
};

export default Enclosure10Reducer;
