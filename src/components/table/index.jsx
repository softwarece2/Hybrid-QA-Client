import { useTheme } from "@material-ui/core/styles";
import MaterialTable from "material-table";
//
import { tableIcons } from "./materialTableIcon";
import MTableFilterRow from "./MTableFilterRow";
import MTableCell from "./MTableCell";
import MTableToolbar from "./MTableToolbar";
import MTableAction from "./MTableAction";
import Paper from "@material-ui/core/Paper";
import { Empty } from "antd";

//
const TableComponent = ({
  data,
  columns,
  title,
  editable,
  isLoading,
  options,
  parentChildData,
  detailPanel,
  onRowClick,
  actions,
  emptyDataSourceMessageProp = "No records to display",
  pageSize = 10,
  onSelectionChange,
  props,
}) => {
  const theme = useTheme();

  const defaultOptions = {
    headerStyle: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        color: "red",
      },
      fontWeight: 400,
      fontSize: "0.875rem",
      padding: "4px",
      zIndex: 1,
    },
    maxBodyHeight: 650,
    filterCellStyle: {
      padding: "4px",
    },
    rowStyle: {
      color: theme.palette.type === "dark" ? "White" : "inherit",
    },
    // searchFieldStyle: { borderRadius: 12 },
    filtering: true,
    actionsColumnIndex: -1,
    debounceInterval: 500,
    pageSize: pageSize,
    emptyRowsWhenPaging: false,
    pageSizeOptions: !!data.length ? [5, 10, 15, 25, { value: data.length, label: "All" }] : [5, 10, 15, 25],
    draggable: false,
    paginationType: "normal",
    padding: "dense",
  };

  return (
    <MaterialTable
      {...props}
      isLoading={isLoading}
      columns={columns.map((c) => ({ ...c, tableData: undefined }))}
      parentChildData={parentChildData}
      data={data}
      actions={actions}
      title={title}
      detailPanel={detailPanel}
      onRowClick={onRowClick}
      editable={editable}
      onSelectionChange={onSelectionChange}
      icons={tableIcons}
      components={{
        Action: (props) => <MTableAction {...props} size="small" />,
        FilterRow: (props) => <MTableFilterRow {...props} />,
        Cell: (props) => <MTableCell {...props} />,
        Toolbar: (props) => <MTableToolbar {...props} searchFieldVariant="outlined" />,
        Container: (props) => <Paper {...props} elevation={0} />,
      }}
      localization={{
        pagination: {
          labelDisplayedRows: "{from}-{to} of {count}",
          labelRowsPerPage: "Rows per page",
        },
        toolbar: {
          nRowsSelected: "{0} row(s) selected",
        },
        header: {
          actions: "Actions",
        },
        body: {
          emptyDataSourceMessage: (
            <div style={{ fontSize: "0.875rem", color: theme.palette.primary.main }}>
              {emptyDataSourceMessageProp && <Empty description={emptyDataSourceMessageProp} style={{ padding: 16 }} />}
            </div>
          ),
          filterRow: {
            filterTooltip: "Filter",
          },
        },
      }}
      style={{ fontSize: "0.875rem" }}
      options={{ ...defaultOptions, ...options }}
    />
  );
};

export default TableComponent;
