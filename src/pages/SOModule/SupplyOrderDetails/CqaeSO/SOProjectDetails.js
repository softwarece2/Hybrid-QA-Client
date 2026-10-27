/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
import "../../../../Styles/projectTable.css";
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,

} from "@material-ui/core";

import { useDispatch } from "react-redux";
import { getProjectDetails } from "Redux/Actions/SupplyOrder/SOAction";
import { DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";


function sumNestedArray(ar) {
  let sum = 0;
  if (ar === null) {
    return 0;
  } else {
    ar.forEach((obj) => {
      sum += 1;
      if (obj?.children?.length > 0) {
        sum += sumNestedArray(obj.children);
      }
    });

    return sum;
  }
}

export default function SOProjectDetails({ openPD, soObj, setOpenPD }) {
 
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  
  const [open, setOpen] = useState(false);

  const getDetails = () => {
    setLoading(true);
    dispatch(getProjectDetails(soObj, 1))
      .then((data) => {
        setRecords(data);
        console.log("data", data);
        console.log("fhbefu", records);
        if (records.length !== 0) {
          setOpen(true);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  const handleClose = () => {
    setOpenPD(false);
  };
  React.useEffect(() => {
    getDetails();
  }, []);
  return (
    <>
      <Dialog
        open={openPD}
        maxWidth="lg"
        fullWidth
        onClose={handleClose}
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title44" {...props} />
        )}>
    

        <DialogTitle
          style={{ fontSize: "0.875rem", cursor: "move" }}
          id="draggable-dialog-title44">
          SO Project Details
        </DialogTitle>

        <DialogContent>
          {!open && (
            <Grid container spacing={1} style={{ marginTop: "15px" }}>
              <Typography>No records to Display</Typography>
            </Grid>
          )}

          {open && (
            <Grid container spacing={1} style={{ marginTop: "15px" }}>
              <table className="dialog_table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Yard</th>
                    <th>Spares</th>
                    <th>Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((el, i) => {
                    //           if (el.children===null){
                    // child=0;

                    //           }
                    if (el.children !== null) {
                      console.log(sumNestedArray(el.children) + 1, "fwuefwuer");
                      return (
                        <React.Fragment key={i}>
                          <tr>
                            <td rowSpan={sumNestedArray(el.children) + 1}>
                              {el.name}
                            </td>
                          </tr>
                          {el.children?.map((childEl, ii) => {
                            return (
                              <React.Fragment key={ii + i}>
                                <tr>
                                  <td
                                    rowSpan={
                                      sumNestedArray(childEl.children) + 1
                                    }>
                                    {childEl.name}
                                  </td>
                                </tr>
                                {childEl.children?.map((el, iii) => (
                                  <React.Fragment key={iii + ii + i}>
                                    <tr>
                                      <td
                                        rowSpan={
                                          sumNestedArray(el.children) + 1
                                        }>
                                        {el.name}
                                      </td>
                                    </tr>
                                    {el.children?.map((el, iiii) => (
                                      <tr key={iiii + iii + ii + i}>
                                        <td>{el.name}</td>
                                      </tr>
                                    ))}
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            );
                          })}
                        </React.Fragment>
                      );
                    }
                  })}
                </tbody>
              </table>
            </Grid>
          )}

          <Grid container spacing={0} style={{ marginTop: "30px" }}>
            <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={handleClose}>
                Close
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* </Grid> */}
    </>
  );
}
