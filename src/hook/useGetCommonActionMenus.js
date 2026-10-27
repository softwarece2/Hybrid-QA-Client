import QualityImprovementNote from "pages/Enclosures/Enclosure8/QualityImprovementNote";
import InspectOL from "pages/InspectorOL";
import QACLScrutiny from "pages/QACLScrutiny";
import QACLScrutinySpares from "pages/QACLScrutiny/scrutinySpares";
import { INSPECT_OL_ID, INSPECT_OL_NUMBER } from "Redux/Types";
import DispatchNote from "pages/Enclosures/DispatchNote/DispatchNote";
import { useDispatch, useSelector } from "react-redux";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import QaSpares from "pages/QASpares";

import SampleSelection from "pages/QACLScrutiny/SampleSelection";
import { USER_DEPARTMENT, USER_ROLE_ID } from "Globals.js";

export const useGetCommonActionMenus = () => {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const dispatch = useDispatch();
  const moreActions = [
    {
      label: "Scrutiny",
      onClick: (rowData) => {
        dispatch(selectItem(<QACLScrutiny inObj={rowData} />));
        dispatch({
          type: INSPECT_OL_ID,
          payload: rowData?.id||rowData.offerLetterId,
        });
        dispatch({
          type: INSPECT_OL_NUMBER,
          payload: rowData,
        });
      },
      tooltip: "Scrutiny",
      hidden: (rowData) => {
        return rowData.soType !== "Main" || loggedInUser?.orgTypeId !== 1;
      },
    },
    {
      label: "Scrutiny-S",
      onClick: (rowData) => {
        dispatch(selectItem(<QACLScrutinySpares inObj={rowData} />));
      },
      tooltip: "Scrutiny-S",
      hidden: (rowData) => {
        return rowData.soType !== "Spares" || loggedInUser?.orgTypeId !== 1;
      },
    },
    {
      label: "Sample Selection",
      onClick: (rowData) => {
        dispatch(selectItem(<SampleSelection rowData={rowData} />));
      },
      tooltip: "Sample Selection",
      hidden: (rowData) => {
        return loggedInUser.orgTypeId !== 1;
      },
    },
   

    {
      label: "Dispatch Note",
      onClick: (rowData) => {
        dispatch(selectItem(<DispatchNote rowData={rowData} />));
      },
      hidden: (rowData) => {
        return !(loggedInUser?.roleId === 9 || loggedInUser?.roleId === 11);
      },
      tooltip: "Dispatch Note",
    },
  ];
  return moreActions;
};
