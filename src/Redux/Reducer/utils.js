import set from "lodash/set";

export const updateFinalObject = (updatedFinalOject, jsonPath, value) => {
    set(updatedFinalOject, jsonPath, value);
    return updatedFinalOject;
};
