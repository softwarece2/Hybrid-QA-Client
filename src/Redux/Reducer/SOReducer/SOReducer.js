import {
  SUPPLY_ORDER,
  SALE_ORDER,
  ITEM_LOT_DATE,
  INSPECT_INSPECTOR,
  FETCH_SO_BY_ORG_ID,
  SUPPLY_ORDER_ID,
  OFFER_LETTERS,
  SELECTED_SO_ID,
  // DD_BY_SO_ID,
  SELECTED_SO_NUMBER,
  DD_LETTER_NUMBER,
  DD_LETTER_DATE,
  AMENDMENT_BY_SO,
  ITEM_LOT_NO,
  SUPPLY_ORDER_BY_SALES_GROUP,
} from "../../Types";

const initialState = {
  supplyOrder: [],
  soBySalesGroup: [],
  saleOrders: [],
  offerLetters: [],
  inspectorDetails: [],
  supplyOderByOrgId: [],
  selectedSo: "",
  selectedSoId: "",
  dd: [],
  itemLotno: "",
  ddLetterNo: "",
  ddLetterDate: "",
  itemLotDate: "",
  amendment:"",
  selectedSoOrderNO:"",
};

const SOReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUPPLY_ORDER:
      return {
        ...state,
        supplyOrder: action.payload,
      };
    case SUPPLY_ORDER_BY_SALES_GROUP:
      return {
        ...state,
        soBySalesGroup: action.payload,
      };
    case SALE_ORDER:
      return {
        ...state,
        saleOrders: action.payload,
      };
    case INSPECT_INSPECTOR:
      return {
        ...state,
        inspectorDetails: action.payload,
      };
    case FETCH_SO_BY_ORG_ID:
      return {
        ...state,
        supplyOderByOrgId: action.payload,
      };
    case SUPPLY_ORDER_ID:
      return {
        ...state,
        selectedSo: action.payload,
      };
    case OFFER_LETTERS:
      return {
        ...state,
        offerLetters: action.payload,
      };
    case SELECTED_SO_ID:
      console.log("jjjnnn");
      // return action.payload;
      return {
        ...state,
        selectedSoId: action.payload,
      };
    case ITEM_LOT_NO:
      return {
        ...state,
        itemLotno: action.payload,
      };

    case ITEM_LOT_DATE:
      return {
        ...state,
        itemLotDate: action.payload,
      };
    case DD_LETTER_NUMBER:
      return {
        ...state,
        ddLetterNo: action.payload,
      };
    case DD_LETTER_DATE:
      return {
        ...state,
        ddLetterDate: action.payload,
      };
       case AMENDMENT_BY_SO:
      return {
        ...state,
        amendment: action.payload,
      };
      case SELECTED_SO_NUMBER:
      return {
        ...state,
        selectedSoOrderNO: action.payload,
      };
    default:
      return state;
  }
};
export default SOReducer;
