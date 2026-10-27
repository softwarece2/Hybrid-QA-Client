import { FETCH_PCB } from "Redux/Types";

const initialState = {
  inspMain: [],
};

const EnclosurePCBReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PCB:
      return {
        ...state,
        inspMain: action.payload,
      };

    default:
      return state;
  }
};

export default EnclosurePCBReducer;
