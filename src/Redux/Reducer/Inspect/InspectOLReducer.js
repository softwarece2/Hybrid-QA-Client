import {
  INSPECT_OL,
  INSPECT_OL_ID,
  // INSPECT_OL_DATE,
  CONSIGNEE_BY_SO,
  GET_FCM_BY_ID,
  INSPECT_OL_NUMBER,
  LINE_ITEMS_BY_OL,
  LEVEL_OF_INSP,
} from "../../Types";

const initialState = {
  inspectOL: [],
  inspectOlId: null,
  inspectOlDate: "",
  consigneeBySO: [],
  fcmById: [],
  inspectOlNumber: "",
  lineItemsByOl: [],
  lvlOfInsp: [],
};

const InspectOLReducer = (state = initialState, action) => {
  switch (action.type) {
    case INSPECT_OL:
      return {
        ...state,
        inspectOL: action.payload,
      };
    case INSPECT_OL_ID:
      return {
        ...state,
        inspectOlId: action.payload,
      };
    case INSPECT_OL_NUMBER:
      return {
        ...state,
        inspectOlNumber: action.payload,
      };

    case CONSIGNEE_BY_SO:
      return {
        ...state,
        consigneeBySO: action.payload,
      };

    case LINE_ITEMS_BY_OL:
      return {
        ...state,
        lineItemsByOl: action.payload,
      };

    case GET_FCM_BY_ID:
      return {
        ...state,
        fcmById: action.payload,
      };

    case LEVEL_OF_INSP:
      return {
        ...state,
        lvlOfInsp: action.payload,
      };

    default:
      return state;
  }
};
export default InspectOLReducer;
