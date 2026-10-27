import { FETCH_FCL_SO } from "Redux/Types";

const initialState = {
  getFcl: [],
};

const FclReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FCL_SO:
      return {
        ...state,
        getFcl: action.payload,
      };

    default:
      return state;
  }
};

export default FclReducer;
