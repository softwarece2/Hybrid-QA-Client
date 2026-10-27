import { SElECTED_HOME_EVENT, } from "../Types";

export const selectedHomeEvent = (state = null, action) => {
  switch (action.type) {
    case SElECTED_HOME_EVENT:
      return  action.payload ;

    default:
      return state;
  }
};
