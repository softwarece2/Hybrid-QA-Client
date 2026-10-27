import { useEffect, useState } from "react";
import { LinearProgress, Table, TableBody, TableHead, TableRow, Typography, makeStyles } from "@material-ui/core";
import { StyledTableCell, StyledTableRow } from "Utils";
import { IOLTableStatus } from "./tvne/IOLTVNEDataView";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";

const useStyles = makeStyles({
  tableBorder: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
});

export default function IOLDataView({ record, setRecord, params, testTypeId }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (testTypeId) {
      const { productTypeId, testTypeId, fromDate, toDate } = params;
      setLoading(true);
      axiosInstanceIol("iolColdTest/getAllColdTestsDevDetails", {
        params: {
          productTypeId,
          testTypeId,
          fromDate,
          toDate,
        },
      })
        .then(({ data }) => {
          setRecord(data);
        })
        .catch(console.log)
        .finally(() => setLoading(false));
    } else {
      setRecord({});
    }
    return () => {
      setRecord();
    };
  }, [setRecord, params, testTypeId]);

  if (!record?.ioldata) {
    return null;
  }

  return (
    <Table size="small">
      <TableHead>
        <StyledTableRow>
          <StyledTableCell className={classes.tableBorder}>S.No.</StyledTableCell>
          <StyledTableCell className={classes.tableBorder}>Device name</StyledTableCell>
          <StyledTableCell className={classes.tableBorder}>Tested On</StyledTableCell>
          <StyledTableCell className={classes.tableBorder} align="center">
            Status
          </StyledTableCell>
          <StyledTableCell className={classes.tableBorder}>Remarks</StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {loading && (
            <StyledTableCell colSpan={5} style={{ padding: 0 }}>
              <LinearProgress />
            </StyledTableCell>
          )}
        </TableRow>
        {record.ioldata.map((el, index) => (
          <StyledTableRow key={index}>
            <StyledTableCell className={classes.tableBorder}>{index + 1}</StyledTableCell>
            <StyledTableCell className={classes.tableBorder}>
              <Typography variant="body2">{el.devNo}</Typography>
            </StyledTableCell>
            <StyledTableCell className={classes.tableBorder}>{el.testDate}</StyledTableCell>
            <StyledTableCell className={classes.tableBorder} align="center">
              <IOLTableStatus status={el.status} />
            </StyledTableCell>
            <StyledTableCell className={classes.tableBorder} style={{ width: "750px" }}>
              {el?.remarks?.split("\n")?.map((el, i) => (
                <Typography variant="body2" key={i + index}>
                  {el}
                </Typography>
              ))}
            </StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  );
}
