import { SUPPLY_ORDER_STATUS } from "../../Types";

const initialState = {
  soStatus: [],
};

const SupplyOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUPPLY_ORDER_STATUS:
      return {
        ...state,
        soStatus: action.payload,
      };

    default:
      return state;
  }
};
export default SupplyOrderReducer;
