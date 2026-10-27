import { ALLOT_JC_OL } from "Redux/Types";

const initialState = {
  allotJcol: [],
};

const AllotOlReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALLOT_JC_OL:
      return {
        ...state,
        allotJcol: action.payload,
      };

    default:
      return state;
  }
};
export default AllotOlReducer;
