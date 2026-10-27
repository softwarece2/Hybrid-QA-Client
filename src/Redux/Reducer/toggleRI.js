import { CLOSE_RI, OPEN_RI } from "../Types";

export default function toggleRI(
  state = { isOpen: false, olNumber: "", lineItemNo: "", devId: "", testId: "", productId: "", testName: "" },
  action
) {
  switch (action.type) {
    case OPEN_RI:
      return {
        isOpen: true,
        olNumber: action.olNumber,
        lineItemNo: action.lineItemNo,
        devId: action.devId,
        testId: action.testId,
        productId: action.productId,
        testName: action.testName,
      };

    case CLOSE_RI:
      return {
        isOpen: false,
        olNumber: "",
        lineItemNo: "",
        devId: "",
        testId: "",
        productId: "",
        testName: ""
      };

    default:
      return state;
  }
}
