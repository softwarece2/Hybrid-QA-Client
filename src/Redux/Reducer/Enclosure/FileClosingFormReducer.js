import { FETCH_FILECLOSING_FORM } from "Redux/Types";

const initialState = {
  getReference: [],
};

const FileClosingFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FILECLOSING_FORM:
      return {
        ...state,
        getReference: action.payload,
      };

    default:
      return state;
  }
};

export default FileClosingFormReducer;
