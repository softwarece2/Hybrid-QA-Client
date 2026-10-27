import { SALE_ORDER_LIST } from "Redux/Types";

const initialState = {
  saleOrderList: [],
};

const SaleOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SALE_ORDER_LIST:
      return {
        ...state,
        saleOrderList: action.payload,
      };

    default:
      return state;
  }
};
export default SaleOrderReducer;
