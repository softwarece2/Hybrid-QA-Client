import { ALLOT_JC } from "Redux/Types";

const initialState = {
  allotJc: [],
};

const AllotjcReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALLOT_JC:
      return {
        ...state,
        allotJc: action.payload,
      };

    default:
      return state;
  }
};
export default AllotjcReducer;
