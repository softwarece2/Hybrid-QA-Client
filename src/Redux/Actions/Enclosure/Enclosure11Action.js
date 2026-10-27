// import axiosInstance from "pages/Services/AxiosInstance";
import { FETCH_INSP_FILE_NOTE } from "Redux/Types";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { fetchfileNote } from "pages/Services/URLs";

export const getInspFileNoteMain = () => async (dispatch) => {
  try {
    const res = await axiosInstanceTrans.get(fetchfileNote);
    dispatch({
      type: FETCH_INSP_FILE_NOTE,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};
