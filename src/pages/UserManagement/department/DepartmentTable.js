import React, { useEffect, useState } from "react";
import TableComponent from "components/table/index";
import axiosInstance from "pages/Services/AxiosInstance";
import InActive from "components/InActive";
import Active from "components/Active";
import EditIcon from "@material-ui/icons/Edit";
import DepartmentForm from "./DepartmentForm";
import { IconButton } from "@material-ui/core";
import ActionButton from "components/ActionButton";

const columns = [
  {
    title: "SalesGroup Name",
    field: "salesGrpName",
  },
  {
    title: "Department Type",
    field: "departmentType",
  },
  {
    title: "Department Name",
    field: "departmentName",
  },
  {
    title: "Section Code",
    field: "sectionCode",
  },
  {
    title: "Status",
    field: "status",
    filtering:false,
    render: (rowData) => (rowData.status ? <Active /> : <InActive />),
  },
];

export default function DepartmentTable() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [edit, setEdit] = useState(false);
  async function getDepartments() {
    setLoading(true);
    try {
      const { data } = await axiosInstance("department/getAllDepts");
      setDepartments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDepartments();
  }, []);

  const actions = [
    {
      icon: () => (
        //Updated Edit Button styles Ivnv Obs - Modified By:Shruti Sanjay
        <ActionButton
        variant="contained"
        size="small"
        color="secondary"
        text="EDIT"
        startIcon={<EditIcon />}
      >
        Edit
      </ActionButton>
      ),
      onClick: (_, rowData) => {
        setSelectedRow(rowData);
         setEdit(true);
      },
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, marginInline: "auto", maxWidth: 1300 }}>
        <DepartmentForm
          reload={getDepartments}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
            edit={edit}
            setEdit={setEdit}
        />
      </div>

      <TableComponent
        isLoading={loading}
        data={departments}
        columns={columns}
        title=""
        actions={actions}
      />
    </>
  );
}
