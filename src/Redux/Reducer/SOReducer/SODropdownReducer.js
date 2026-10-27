import {
  CONSIGNEE_ID,
  FIVE_YEAR_ID,
  I_NOTE,
  PROJECT_DETAILS_GRAPH,
  PROJECT_DETAILS_ID,
  SALES_GROUP_ID,
  ACCT_TYPE_ID,
} from "Redux/Types";
import { INDENTER_ID } from "Redux/Types";
import { SUPPLIER_ID } from "Redux/Types";

const initialState = {
  supplier: [],
  iNote: [],
  indent: [],
  consignee: [],
  salesGroup: [],
  projectListDetails: [],
  yearListDetails: [],
  projectListDetailsGraph: [],
  accountTypes: [],
};

const INoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case I_NOTE:
      return {
        ...state,
        iNote: action.payload,
      };

    case INDENTER_ID:
      return {
        ...state,
        indent: action.payload,
      };
    case SUPPLIER_ID:
      return {
        ...state,
        supplier: action.payload,
      };
    case CONSIGNEE_ID:
      return {
        ...state,
        consignee: action.payload,
      };
    case SALES_GROUP_ID:
      return {
        ...state,
        salesGroup: action.payload,
      };
    case PROJECT_DETAILS_ID:
      return {
        ...state,
        projectListDetails: action.payload,
      };
    case FIVE_YEAR_ID:
      return {
        ...state,
        yearListDetails: action.payload,
      };
    case PROJECT_DETAILS_GRAPH:
      return {
        ...state,
        projectListDetailsGraph: action.payload,
      };
    case ACCT_TYPE_ID:
      return {
        ...state,
        accountTypes: action.payload,
      };

    default:
      return state;
  }
};
export default INoteReducer;
