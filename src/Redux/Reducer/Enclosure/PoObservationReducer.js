import { FETCH_PO_OBSERVATION } from "Redux/Types";

const initialState = {
  getPo: [],
};

const PoObservationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PO_OBSERVATION:
      return {
        ...state,
        getPo: action.payload,
      };

    default:
      return state;
  }
};

export default PoObservationReducer;
