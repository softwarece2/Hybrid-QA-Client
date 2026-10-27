/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../App.css";

//globals
import { WING_ID } from "../../Globals";
//pages

//component
import TableComponent from "components/table/index";

//material-ui
import { Grid } from "@material-ui/core";
import { useDispatch } from "react-redux";
import AxiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";
import { getReturnOLBySalesGrpId, getReturnOlByEmpid } from "pages/Services/URLs";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import ReturnOL from "pages/Enclosures/Enclosure4/ReturnOL";
import ActionButton from "components/ActionButton";
import moment from "moment";
import { USER_ROLE_ID } from "../../Globals";

//icons
const now = moment(new Date()).format("DD-MM-YYYY");

export default function ReturnedOL() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const [columns] = useState([
    isArmy
      ? { title: "Submission Slip No.", field: "offerLetterNo", width: "auto" }
      : { title: "OL Number", field: "offerLetterNo", width: "auto" },
    { title: "SO Number", field: "soNumber", width: "auto" },
    { title: "SBU", field: "salesGrp", width: "auto" },
    { title: "Project Name", field: "projectName", width: "auto" },
    {
      title: "Date and Time",
      field: "createdDateStr",
      width: "auto",
      filtering: true,
      value: now,
    },
  ]);

  const getReturnOlByEmp = () => {
    setLoading(true);
    const url =
      loggedInUser?.roleId === USER_ROLE_ID?.ROLE_FIRM_ADMIN
        ? getReturnOLBySalesGrpId + loggedInUser?.salesGrpId
        : getReturnOlByEmpid + loggedInUser?.empId;
    AxiosInstanceTransaction.get(url)
      .then(({ data }) => {
        setRecords(
          data.map((el, i) => ({
            ...el,
          }))
        );
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    getReturnOlByEmp();
  }, []);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            actions={[
              {
                icon: () => (
                  <ActionButton variant="outlined" size="small" color="secondary" obs={"obs"}>
                    View
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  dispatch(selectItem(<ReturnOL num={rowData?.offerLetterId} from={2} />));
                },
              },
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
}
