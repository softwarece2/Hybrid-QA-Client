import { combineReducers } from "redux";
import { selectedTreeItem } from "./Reducer/SelectedTreeItem";
import { loginOrSignup } from "./Reducer/LoginOrSingup";
import { selectedTheme } from "./Reducer/SelectedTheme";
import { prepareFinalObject } from "./Reducer/MdmsReducer";
import { selectedHomeEvent } from "./Reducer/selectedHomeEvent";
import { selectedMenu } from "./Reducer/SelectedMenu";
import { loggedInUser } from "./Reducer/User";
import InspectSOReducer from "./Reducer/Inspect/InspectSOReducer";
import InspectOLReducer from "./Reducer/Inspect/InspectOLReducer";
import toggleRI from "./Reducer/toggleRI"
import registrationNumber from "./Reducer/RegistrationNumber"
//supply order
import SOReducer from "./Reducer/SOReducer/SOReducer";
import PDReducer from "./Reducer/SOReducer/PDReducer";
import Enclosure2BReducer from "./Reducer/Enclosure/Enclosure2BReducer";
import Enclosure9Reducer from "./Reducer/Enclosure/Enclosure9Reducer";
import Enclosure10Reducer from "./Reducer/Enclosure/Enclosure10Reducer";
import EnclosureISIBReducer from "./Reducer/Enclosure/EnclosureISIBReducer";
import EnclosurePCBReducer from "./Reducer/Enclosure/EnclosurePcbReducer";
import EnclosureSCMReducer from "./Reducer/Enclosure/EnclosureSCMReducer";
import SODropdownReducer from "./Reducer/SOReducer/SODropdownReducer";
import UnreadNotificationsReducer, { UnreadNotificationsReducerSender } from "./Reducer/Notifications/UnreadNotificationReducer";
import Enclosure11Reducer from "./Reducer/Enclosure/Enclosure11Reducer";
import SaleOrderReducer from "./Reducer/SOReducer/SaleOrderReducer";
import FclReducer from "./Reducer/Enclosure/FclReducer";
import PoObservationReducer from "./Reducer/Enclosure/PoObservationReducer";
import SOWorkLoadAssesment from "./Reducer/SOReducer/SOWorkloadReducer";
import SupplyOrderReducer from "./Reducer/BarGraphReducer/SupplyOrderBarReducer";
import Enclosure14Reducer from "./Reducer/Enclosure/Enclosure14Reducer";
import AllotacqaoReducer from "./Reducer/AllotjcReducer/AllotjcReducer";
import AllotOlReducer from "./Reducer/AllotjcReducer/AllotOlReducer";
import OrgTypeReducer from "./Reducer/UserManagement/OrganizationTypeReducer";
import OrgReducer from "./Reducer/UserManagement/OrganizationReducer";
import ScrutinySoReducer from "./Reducer/Enclosure/ScrutinySoReducer";
import FileClosingFormReducer from "./Reducer/Enclosure/FileClosingFormReducer";
import ChecklistFileCloseReducer from "./Reducer/Enclosure/ChecklistFileCloseReducer";
import OLWorkLoadAssesment from "./Reducer/OLReducer/OLWorkloadReducer";
import ViewScrutinyReducer from "./Reducer/ViewScrutinyReducer";
import ReturnOLReducer from "./Reducer/ReturnOLReducer/ReturnOLReducer";
import { previousItemReducer } from "./Reducer/previousItem";
import registrationNumberAdd from "./Reducer/RegistrationNumberAdd";

export default combineReducers({
  selectedTreeItem,
  previousItem: previousItemReducer,
  loginOrSignup,
  selectedTheme,
  prepareFinalObject,
  selectedHomeEvent,
  selectedMenu,
  loggedInUser,
  inspectSOReducer: InspectSOReducer,
  inspectOLReducer: InspectOLReducer,
  soReducer: SOReducer,
  pdReducer: PDReducer,
  soDropdownReducer: SODropdownReducer,
  enclosure2BReducer: Enclosure2BReducer,
  enclosure9Reducer: Enclosure9Reducer,
  enclosure10Reducer: Enclosure10Reducer,
  enclosureISIBReducer: EnclosureISIBReducer,
  enclosurePCBReducer: EnclosurePCBReducer,
  enclosureSCMReducer: EnclosureSCMReducer,
  unreadNotificationsReducer: UnreadNotificationsReducer,
  unreadNotificationsReducerSender: UnreadNotificationsReducerSender,
  enclosure11Reducer: Enclosure11Reducer,
  saleOrderReducer: SaleOrderReducer,
  fclReducer: FclReducer,
  poObservationReducer: PoObservationReducer,
  sOWorkLoadAssesment: SOWorkLoadAssesment,
  supplyOrderReducer: SupplyOrderReducer,
  enclosure14Reducer: Enclosure14Reducer,
  allotacqaoReducer: AllotacqaoReducer,
  allotOlReducer: AllotOlReducer,
  orgTypeReducer: OrgTypeReducer,
  orgReducer: OrgReducer,
  scrutinySoReducer: ScrutinySoReducer,
  fileClosingFormReducer: FileClosingFormReducer,
  checklistFileCloseReducer: ChecklistFileCloseReducer,
  oLWorkLoadAssesment: OLWorkLoadAssesment,
  viewScrutinyReducer: ViewScrutinyReducer,
  returnOLReducer: ReturnOLReducer,
  toggleRI,
  registrationNumber,
  registrationNumberAdd,
});
