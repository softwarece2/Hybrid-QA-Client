import React, { useEffect, useState } from "react";
import TableComponent from "components/table/index";
import axiosInstance from "pages/Services/AxiosInstance";
import InActive from "components/InActive";
import Active from "components/Active";
import EditIcon from "@material-ui/icons/Edit";
import ActionButton from "components/ActionButton";
import UnitForm from "./UnitForm";
const columns = [
  {
    title: "Organization Name",
    field: "organizationName",
  },
  {
    title: "Unit Name",
    field: "unitName",
  },
  {
    title: "Status",
    field: "active",
    render: (rowData) => (rowData.active ? <Active /> : <InActive />),
  },
];

export default function UnitTable() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  async function getUnits() {
    setLoading(true);
    try {
      const { data } = await axiosInstance("unit/getAll");
      setUnits(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUnits();
  }, []);

  const actions = [
    {
      icon: () => (
        <ActionButton
          variant="contained"
          size="small"
          color="secondary"
          text="Edit"
          startIcon={<EditIcon />}
        >
          Edit
        </ActionButton>
      ),
      onClick: (_, rowData) => {
        setSelectedRow(rowData);
      },
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, marginInline: "auto", maxWidth: 600 }}>
        <UnitForm
          reload={getUnits}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      </div>

      <TableComponent
        isLoading={loading}
        data={units}
        columns={columns}
        title=""
        actions={actions}
      />
    </>
  );
}
