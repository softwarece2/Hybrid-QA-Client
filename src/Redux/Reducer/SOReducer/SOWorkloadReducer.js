import {  GET_SOWORKLOAD_ASSESMENT } from "Redux/Types";

const initialState = {
  inspMain: [],
};

const SOWorkLoadAssesment = (state = initialState, action) => {
  switch (action.type) {
    case GET_SOWORKLOAD_ASSESMENT:
      return {
        ...state,
        inspMain: action.payload,
      };

    default:
      return state;
  }
};

export default SOWorkLoadAssesment;
