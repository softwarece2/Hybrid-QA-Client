import { FETCH_SAVED_DETAILS_FCM } from "Redux/Types";

const initialState = {
  savedFcm: [],
};

const Enclosure2BReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SAVED_DETAILS_FCM:
      return {
        ...state,
        savedFcm: action.payload,
      };

    default:
      return state;
  }
};

export default Enclosure2BReducer;
