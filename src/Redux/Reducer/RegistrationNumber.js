import { REG_NO_GET_DATA, REG_NO_LOADING_FALSE, REG_NO_LOADING_TRUE} from "../Types";

export default function registrationNumber(
  state = { },
  { type, payload }
) {
  switch (type) {
    
    case REG_NO_GET_DATA:
      return {
        ...state,
        [payload.id]: {...state[payload.id], data: payload.data},
      };

    case REG_NO_LOADING_TRUE:
      return {
        ...state,
        [payload.id]: {...state[payload.id], loading: true}, 
      };
       case REG_NO_LOADING_FALSE:
      return {
        ...state,
        [payload.id]: {...state[payload.id], loading: false}, 
      };

    default:
      return state;
  }
}
