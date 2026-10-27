import { FETCH_SPARES, INSP_PDI_MAIN } from "Redux/Types";

const initialState = {
  spares: [],
  pdimain: [],
};

const Enclosure14Reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SPARES:
      return {
        ...state,
        spares: action.payload,
      };
    case INSP_PDI_MAIN:
      return {
        ...state,
        pdimain: action.payload,
      };

    default:
      return state;
  }
};
export default Enclosure14Reducer;
