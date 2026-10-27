import { useEffect, useState } from "react";
import { LinearProgress, Table, TableBody, TableHead, TableRow, Typography, makeStyles } from "@material-ui/core";
//
import { StyledTableCell, StyledTableRow } from "Utils";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";

const useStyles = makeStyles({
  tableBorder: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
});

const url = "iolTvne/getQuarterlyByProdIdAndDevNm";

export default function IOLTVNEDataView({ record, setRecord, params, testTypeId, selectedYear }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (testTypeId) {
      setLoading(true);
      const { productTypeId, fromDate, toDate } = params;
      if (testTypeId === 2 || testTypeId === 3 || testTypeId === 4) {
        axiosInstanceIol(url, {
          params: {
            productTypeId,
            testTypeId,
            year: new Date(selectedYear).getFullYear(),
          },
        })
          .then(({ data }) => {
            setRecord({listTvneSearchDtos:data});
          })
          .catch(console.log)
          .finally(() => setLoading(false));
      } else {
        axiosInstanceIol("iolTvne/getAllTvneDevDetails", {
          params: {
            productTypeId,
            testTypeId: testTypeId,
            fromDate,
            toDate,
          },
        })
          .then(({ data }) => {
            setRecord(data);
          })
          .catch(console.log)
          .finally(() => setLoading(false));
      }
    } else {
      setRecord({});
    }
    return () => {
      setRecord();
    };
  }, [params, selectedYear, setRecord, testTypeId]);

  if (!record?.listTvneSearchDtos) {
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
        {record.listTvneSearchDtos?.map((el, index) => (
          <StyledTableRow key={index}>
            <StyledTableCell className={classes.tableBorder}>{index + 1}</StyledTableCell>
            <StyledTableCell className={classes.tableBorder}>
              <Typography variant="body2">{el.devName}</Typography>
            </StyledTableCell>
            <StyledTableCell className={classes.tableBorder}>{el.submittedDate}</StyledTableCell>
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

export function IOLTableStatus({ status }) {
  if (status === 1) {
    return <span style={{ color: "green" }}>Accepted</span>;
  }

  if (status === 0) {
    return <span style={{ color: "red" }}>Rejected</span>;
  }

  return <span style={{ color: "grey" }}>N/A</span>;
}
