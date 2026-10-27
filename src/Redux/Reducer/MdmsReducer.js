import { UPDATE_OBJECT, USER_ROLE } from "../Types";
import { updateFinalObject } from "./utils";

export const initialState = {
  updatedFinalObject: {},
  role: "",
};

export const prepareFinalObject = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_OBJECT:
      const updatedFinalObject = updateFinalObject(state.updatedFinalObject, action.path, action.value);
      return {
        ...state,
        updatedFinalObject: updatedFinalObject,
      };

    case USER_ROLE:
      return {
        ...state,
        role: action.payload,
      };
    default:
      return state;
  }
};
