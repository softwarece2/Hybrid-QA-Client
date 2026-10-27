import { TREE_ITEM } from "../Types";
import OnRefresh from "pages/Notifications/OnRefresh";

export const selectedTreeItem = (state = <OnRefresh />, action) => {
  switch (action.type) {
    case TREE_ITEM:
      return action.payload;

    default:
      return state;
  }
};
