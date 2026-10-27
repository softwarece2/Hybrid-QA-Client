import { GET_OLWORKLOAD_ASSESMENT } from "Redux/Types";

const initialState = {
  inspMain: [],
};

const OLWorkLoadAssesment = (state = initialState, action) => {
  switch (action.type) {
    case GET_OLWORKLOAD_ASSESMENT:
      return {
        ...state,
        inspMain: action.payload,
      };

    default:
      return state;
  }
};

export default OLWorkLoadAssesment;
