import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  LinearProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { useReactToPrint } from "react-to-print";

const useStyles = makeStyles((theme) => ({
  tabLabel: {
    fontSize: "0.75rem", // Optional: adjust text size to match the dense layout
  },
  tableDesign: {
    fontSize: "14px",

    "& thead tr td": {
      border: "1px solid grey",
      padding: "6px 12px",
      color: "white",
      backgroundColor: "#205375",
      fontSize: "14px",
    },
  },
}));

const SampleWiseDetail = ({ selectedRow, rowData, onClose, header, selectedUploadRow }) => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const fetchDataSample = (id, sampleName) => {
    if (id && sampleName) {
      let url = `McdpResult/getMcdpByLineItemId/${id}/${selectedRow.sampleName}`;
      if (selectedUploadRow?.applicableTestId === 18) {
        url = `dimensionTest/getByLineItemId/${id}/${selectedRow.sequence}`
      }
      setLoading(true);
      axiosInstance
        .get(url)
        .then(({ data }) => {
          setData(data);
          console.log(data)
        })
        .catch((e) => { console.log(e) })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    fetchDataSample(rowData.id, selectedRow);
  }, []);
  return (
    <Dialog open maxWidth="lg" fullWidth>
      <DialogContent>
        <Typography variant="h5">{selectedRow?.sampleName || (selectedRow.sequence ? 'TMR-' + selectedRow?.sequence : '')}</Typography>
        <div
          style={{ display: "flex", flexDirection: "column", fontSize: 12 }}
          ref={componentRef}
        >
          {loading && <LinearProgress />}
          <table
            style={{
              borderCollapse: "collapse",
              marginTop: 10,
              borderRadius: 8,
            }}
            className={classes.tableDesign}
          >
            <thead>

              <tr>
                {header?.map((el) => (
                  <td key={el.id}>
                    {el.label}
                  </td>
                ))}

              </tr>
            </thead>
            <tbody>
              {data?.map((item) => (
                <tr>
                  {header?.map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        border: "1px solid lightgrey",
                        padding: "6px 12px"
                      }}>
                      {item[cell.id]}
                    </td>
                  ))}
                </tr>

              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6}>No records found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderRadius: 8,
              marginTop: 24,
            }}
          >
            <div>
              TESTED BY: <br /> ______________
              <br />
              SIGNATURE: <br />
              ______________
              <br />
              ST NO: <br /> ______________
              <br />
              DATE: <br /> ______________
            </div>
            <div>
              APPROVED BY: <br /> ____________
              <br />
              SIGNATURE: <br />
              _____________
              <br />
              ST NO: <br />
              _______________
              <br />
              DATE: <br /> _______________
            </div>
            <div>
              ACCEPTED BY: <br />
              _______________
              <br />
              SIGNATURE: <br />
              _______________
              <br />
              ID NO: <br />
              _____________
              <br />
              DATE: <br />
              _____________
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <>
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Print
          </Button>
          <Button
            size="small"
            style={{ marginLeft: 16 }}
            variant="outlined"
            color="secondary"
            onClick={onClose}
          >
            Close
          </Button>
        </>
      </DialogActions>
    </Dialog>
  );
};

export default SampleWiseDetail;
