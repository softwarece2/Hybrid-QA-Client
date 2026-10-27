import { FIRM_TYPES, INSPECTION_AGENCY, INSPECTION_AGENCY_OF_FIRM, ORG_NAME, WING_TYPES } from "Redux/Types";


const initialState = {
  orgname: [],
  firmType: [],
  wingType: [],
  inspectionAgencyType: [],
  inspectionAgencyTypeOfFirm: [],
};

const OrgReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORG_NAME:
      return {
        ...state,
        orgname: action.payload,
      };      
      case FIRM_TYPES:
        return {
          ...state,
          firmType: action.payload,
        };
        case WING_TYPES:
          return {
            ...state,
            wingType: action.payload,
          };
        case INSPECTION_AGENCY:
        return {
          ...state,
          inspectionAgencyType: action.payload,
        };
        case INSPECTION_AGENCY_OF_FIRM:
          return {
            ...state,
            inspectionAgencyTypeOfFirm: action.payload,
          };

    default:
      return state;
  }
};
export default OrgReducer;
