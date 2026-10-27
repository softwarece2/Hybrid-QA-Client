import { useEffect, useState } from "react";
import { IconButton } from "@material-ui/core";
import { EditOutlined } from "@material-ui/icons";
//
import axiosInstance from "pages/Services/AxiosInstance";
import MasterPartNoForm from "./MasterPartNoForm";
import TableComponent from "components/table/index";
import Active from "components/Active";
import InActive from "components/InActive";

const columns = [
  {
    title: "Material No./EP Code No.",
    field: "partNo",
  },
  {
    title: "CAT Part No.",
    field: "catPartNo",
  },
  {
    title: "NSN Part No.",
    field: "nsnPartNo",
  },
  {
    title: "Material Description",
    field: "materialDescription",
  },
  {
    title: "Drawing No.",
    field: "drawingNo",
  },
  {
    title: "Uom",
    field: "uom",
  },
  {
    title: "Item Category",
    field: "itemCategory",
  },
  {
    title: "Status",
    field: "active",
    render: (rowData) => (rowData.active ? <Active /> : <InActive />),
  },
];

export default function MasterPartNo() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [edit, setEdit] = useState(false);
  function getMappedTests() {
    setLoading(true);
    axiosInstance("partNumber/getAll")
      .then(({ data }) => {
        setRecords(data);
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getMappedTests();
  }, []);

  return (
    <>
      <MasterPartNoForm refresh={getMappedTests} selectedRow={selectedRow} setSelectedRow={setSelectedRow} edit={edit}
        setEdit={setEdit} />

      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title=""
        options={{ filtering: false }}
        actions={[
          {
            icon: () => (
              <IconButton variant="outlined" size="small" color="primary">
                <EditOutlined />
              </IconButton>
            ),
            onClick: (_, rowData) => {
              setSelectedRow(rowData);
              setEdit(true);
            },
          },
        ]}
      />
    </>
  );
}
