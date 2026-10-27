import { INSPECT_SO } from "../../Types";

const initialState = {
  inspectSO: [],
};

const InspectSOReducer = (state = initialState, action) => {
  switch (action.type) {
    case INSPECT_SO:
      return {
        ...state,
        inspectSO: action.payload,
      };

    default:
      return state;
  }
};
export default InspectSOReducer;
