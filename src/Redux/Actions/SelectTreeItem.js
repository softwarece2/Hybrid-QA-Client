import { TREE_ITEM, UPDATE_OBJECT,PREVIOUS_ITEM } from "../Types";

export const selectItem = item => {
  return { type: TREE_ITEM, payload: item };
};

export const previousItem = item => {
  return { type: PREVIOUS_ITEM, payload: item };
};

export const updateFinalObject = (path, value) => ({
  type: UPDATE_OBJECT,
  path,
  value
});