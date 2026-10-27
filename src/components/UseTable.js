import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  TablePagination,
  TableSortLabel,
  Button,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useTheme } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },

  table: {
    "& thead th": {
      fontWeight: 400,
      fontSize: "0.875rem",
      color: theme.palette.common.white,
      // color: theme.palette.primary.contrastText,
    },
    "& tbody td": {
      // fontWeight: "200",
    },
    "& tbody tr:hover": {
      // cursor: "pointer",
    },
    "& .MuiTableCell-root": {
      // padding: "3px 5px 5px 15px",
    },
    "& .MuiTableCell-head": {
      // padding: theme.spacing(0), //1
    },
  },
  actionText: {
    fontSize: "0.875rem",
    textTransform: "capitalize",
  },
  actionButton: {
    border: "1px solid #ddd0d0",
    marginRight: "10px",
  },
  paginationSection: {
    display: "flex",
    justifyContent: "end",
  },
}));

export const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    // color: "theme.palette.primary.light",
    color: theme.palette.common.white,
    fontSize: "0.875rem",
    padding: 8,
    // fontStyle:bold,
  },
  body: {
    fontSize: "0.875rem",
    padding: 8,
  },
}))(TableCell);

export const StyledTableCellPrint = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    // color: "theme.palette.primary.light",
    color: theme.palette.common.white,
    fontSize: "0.625rem",
    padding: 2,
  },
  body: {
    fontSize: "0.625rem",
    padding: 0.2,
  },
}))(TableCell);

export const StyledPreviewTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    // color: "theme.palette.primary.light",
    color: theme.palette.common.white,
    fontSize: "0.875rem",
    padding: 4,
  },
  body: {
    fontSize: "0.875rem",
    padding: 4,
  },
}))(TableCell);

export const StyledTableRow = withStyles((theme) => ({
  root: {
    // "&:nth-of-type(even)": {
    //   backgroundColor: theme.palette.action.focus,
    // },
    fontSize: "0.875rem",
    padding: 8,
    height: 30,
  },
}))(TableRow);

function TablePaginationActions(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <Button
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        className={classes.actionButton}
        startIcon={<FontAwesomeIcon icon={faAngleDoubleLeft} />}
      >
        {theme.direction === "rtl" ? (
          <Typography className={classes.actionText}>first</Typography>
        ) : (
          <Typography className={classes.actionText}>first</Typography>
        )}
      </Button>
      <Button
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        className={classes.actionButton}
        startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
      >
        {theme.direction === "rtl" ? (
          <Typography className={classes.actionText}>previous</Typography>
        ) : (
          <Typography className={classes.actionText}>previous</Typography>
        )}
      </Button>
      <Button
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        className={classes.actionButton}
        endIcon={<FontAwesomeIcon icon={faAngleRight} />}
      >
        {theme.direction === "rtl" ? (
          <Typography className={classes.actionText}> next</Typography>
        ) : (
          <Typography className={classes.actionText}> next</Typography>
        )}
      </Button>
      <Button
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        className={classes.actionButton}
        endIcon={<FontAwesomeIcon icon={faAngleDoubleRight} />}
      >
        {theme.direction === "rtl" ? (
          <Typography className={classes.actionText}> Last</Typography>
        ) : (
          <Typography className={classes.actionText}> Last</Typography>
        )}
      </Button>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
const pages = [15, 20, 30, 40];

export default function useTable(records, headCells, filterFn, defaultRows = 1000) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  useEffect(() => {
    setPage(0);
    setRowsPerPage(defaultRows);
  }, [filterFn, defaultRows, records]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const stableSort = (array, comparator) => {
    if (Array.isArray(array)) {
      const stabilizedThis = array?.map((el, index) => [el, index]);
      stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
      return stabilizedThis?.map((el) => el[0]);
    }
  };

  const getComparator = React.useCallback(
    (order, orderBy) =>
      order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy),
    []
  );

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const TblContainer = (props) => (
    <Table size="small" className={classes.table}>
      {props.children}
    </Table>
  );

  const TblHead = (props) => {
    const handleSortRequest = (cellId) => {
      const isAsc = orderBy === cellId && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(cellId);
    };

    return (
      // <ThemeProvider theme={DefaultTheme.default}>

      <TableHead>
        <StyledTableRow>
          {headCells.map((headCell) => (
            <StyledTableCell
              align={headCell?.align ? headCell.align : "center"}
              key={headCell.id}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {headCell.disableSorting ? (
                headCell.label
              ) : (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={() => {
                    handleSortRequest(headCell.id);
                  }}
                >
                  {headCell.label}
                </TableSortLabel>
              )}
            </StyledTableCell>
          ))}
        </StyledTableRow>
      </TableHead>

      // </ThemeProvider>
    );
  };

  const TblPagination = () => {
    const filteredLength = React.useMemo(() => filterFn.fn(records)?.length, []);
    return (
      <>
        <TablePagination
          rowsPerPageOptions={[15, 20, 30, 40, { label: "All", value: filteredLength }]}
          colSpan={3}
          count={filteredLength}
          rowsPerPage={rowsPerPage}
          page={page}
          pagination
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
            native: true,
          }}
          className={classes.paginationSection}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </>
    );
  };

  const recordsAfterPagingAndSorting = React.useCallback(() => {
    return stableSort(filterFn?.fn(records), getComparator(order, orderBy))?.slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );
  }, [filterFn, getComparator, order, orderBy, page, records, rowsPerPage]);

  const getSlNo = (index) => {
    return page * rowsPerPage + (index + 1);
  };

  return {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    getSlNo,
  };
}
