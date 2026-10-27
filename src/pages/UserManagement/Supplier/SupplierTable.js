/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import "../../../App.css";

//pages
import axiosInstance from "pages/Services/AxiosInstance";
import { getAllSupplier } from "pages/Services/URLs";
import SupplierForm from "./SupplierForm";
//component
import ActionButton from "components/ActionButton";
import Active from "components/Active";
import InActive from "components/InActive";
import TableComponent from "components/table/index";

//material-ui
import { Grid} from "@material-ui/core";



//icons
import EditIcon from "@material-ui/icons/Edit";

export default function SupplierTable() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [supplierObj, setsupplierObj] = useState({});

  const [columns] = useState([
    {
      title: "Supplier Name",
      field: "name",
      width: "auto",
      filtering: true,
    },

    {
      title: "Status",
      field: "active",
      width: "auto",
      filtering: false,
    },
  ]);
 

  const fetchSupplier = () => {
    setLoading(true);
    axiosInstance
      .get(getAllSupplier)
      .then(({ data }) => {
        setRecords(
          data.map((el, i) => ({
            ...el,

            supplierStatusValue: el?.active,
            active: el?.active ==true ? <Active /> : el?.active == false ? <InActive /> : null,
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
    fetchSupplier();
  }, []);

  return (
    <>
      <Grid container spacing={2} alignItems="center" align="center">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <SupplierForm fetch={fetchSupplier} supplierDetails={supplierObj} records={records} />
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
                  <ActionButton variant="contained" size="small" color="secondary" startIcon={<EditIcon />}>
                    Edit
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  const data = {
                    ...rowData,
                    active: rowData?.supplierStatusValue ? "true" : "false",
                  };
                  setsupplierObj(data);
                  console.log("supplierObj", data);
                },
              },
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
}
