import React, { useEffect, useState } from "react";
import "../../../App.css";
import { fetchIndentId } from "pages/Services/URLs";
//pages

//component
import TableComponent from "components/table/index";

//pages
import AddIndenterForm from "./AddIndenterForm";

//material-ui
import { Grid} from "@material-ui/core";
import axiosInstance from "pages/Services/AxiosInstance";
import Active from "components/Active";
import InActive from "components/InActive";
import EditIcon from "@material-ui/icons/Edit";
import ActionButton from "components/ActionButton";



export default function AddIndenterTable() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [indenterObj, setindenterObj] = useState({});
  const [columns] = useState([
    {
      title: "Indentor Name",
      field: "name",
      width: "auto",
      filtering: true,
    },
    {
      title: "Short Name",
      field: "shortName",
      width: "auto",
      filtering: true,
    },
    {
      title: "Address",
      field: "address",
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

  const fetchIndenter = () => {
    setLoading(true);
    axiosInstance
      .get(fetchIndentId)
      .then(({ data }) => {
        setRecords(
          data.map((el, i) => ({
            ...el,
            activeValue: el?.active,
            active: el?.active === true ? <Active /> : el?.active === false ? <InActive /> : null,
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
    fetchIndenter();
  }, []);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          <AddIndenterForm
            fetch={fetchIndenter}
            indenterDetails={indenterObj}
            records={records}
          />
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
                  <ActionButton
                    variant="contained"
                    size="small"
                    color="secondary"
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  const data = {
                    ...rowData,
                    active: rowData?.activeValue ? "1" : "0",
                  };
                  setindenterObj(data);
                  console.log("indenterdetails", data);
                },
              },
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
}
