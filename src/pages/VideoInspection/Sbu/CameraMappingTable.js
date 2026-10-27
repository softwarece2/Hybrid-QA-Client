import { useEffect, useState } from "react";
import "../../../../src/App.css";
import axiosInstance from "pages/Services/AxiosInstance";
import CameraMapping from "./CameraMapping";
import ActionButton from "components/ActionButton";
import TableComponent from "components/table/index";
import { Grid } from "@material-ui/core";
import { useSelector } from "react-redux";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete"; // Imported Delete Icon
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";

export default function CameraMappingTable() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sbuCameratObj, setSbuCameraObj] = useState({});
  const [columns] = useState([
    {
      title: "Camera IP",
      field: "cameraIp",
      width: "auto",
      filtering: true,
    },
    {
      title: "Camera Name",
      field: "sbuName",
      width: "auto",
      filtering: true,
    },
    {
      title: "Test Name",
      field: "testName", // Display the comma separated string
      width: "auto",
      filtering: true,
    },
  ]);

  const salesgrpId = useSelector((store) => store.loggedInUser?.salesGrpId);

  const fetchsbuCameraMappingBySalesGrpId = () => {
    setLoading(true);
    // if (!salesgrpId) {
    //   console.error("Sales Group ID is missing");
    //   setLoading(false);
    //   return;
    // }
    axiosInstanceAte
      .get(`sbuCameraMapping/getAll`)
      .then(({ data }) => {
        console.log("Fetched data:", data);
        setRecords(
          data.map((el, i) => ({
            ...el,
            // Process the array of objects into a single string for the table column
            testNames: el.tests ? el.tests.map((t) => t.testName).join(", ") : "",
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
    fetchsbuCameraMappingBySalesGrpId();
  }, [salesgrpId]);

  return (
    <>
      <Grid container spacing={2} alignItems="center" align="center">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <CameraMapping
            fetch={fetchsbuCameraMappingBySalesGrpId}
            appTestDetails={sbuCameratObj}
            records={records}
          />
        </Grid>

        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            actions={[
              {
                icon: () => (
                  <ActionButton
                    variant="contained"
                    size="small"
                    color="secondary"
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  const data = {
                    ...rowData,
                    active: rowData?.appTestStatusValue ? "true" : "false",
                    // Ensure the raw 'tests' array is passed to the form for pre-filling
                    tests: rowData.tests || [], 
                  };
                  setSbuCameraObj(data);
                  console.log("appTestObj", data);
                },
              },
              // DELETE BUTTON - Commented out as requested
              /*
              {
                icon: () => (
                  <ActionButton
                    variant="contained"
                    size="small"
                    color="secondary" // or "error" depending on theme
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  // TODO: Add delete logic here
                  // Example:
                  // axiosInstance.delete(`sbuCameraMapping/delete/${rowData.id}`)
                  //   .then(() => {
                  //      toast.success("Deleted successfully");
                  //      fetchsbuCameraMappingBySalesGrpId();
                  //   });
                  console.log("Delete clicked for", rowData);
                },
              },
              */
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
}