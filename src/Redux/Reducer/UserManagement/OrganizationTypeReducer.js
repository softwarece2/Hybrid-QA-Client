import { ORG_TYPE, USER_TYPES } from "Redux/Types";

const initialState = {
  orgtypename: [],
  usertype:[],
};

const OrgTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORG_TYPE:
      return {
        ...state,
        orgtypename: action.payload,
      };
      case USER_TYPES:
        return {
          ...state,
          usertype: action.payload,
        };

    default:
      return state;
  }
};
export default OrgTypeReducer;
