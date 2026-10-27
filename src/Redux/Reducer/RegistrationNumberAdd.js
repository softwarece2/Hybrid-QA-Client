import { REG_NO_TOGGLE_CLOSE, REG_NO_TOGGLE_OPEN } from "../Types";

export default function registrationNumberAdd(state = { isOpen: false, selectedYear: {} }, { type, payload }) {
  switch (type) {
    case REG_NO_TOGGLE_OPEN:
      return {
        selectedYear: payload.selectedYear,
        isOpen: true,
      };

    case REG_NO_TOGGLE_CLOSE:
      return {
        selectedYear: {},
        isOpen: false,
      };

    default:
      return state;
  }
}
