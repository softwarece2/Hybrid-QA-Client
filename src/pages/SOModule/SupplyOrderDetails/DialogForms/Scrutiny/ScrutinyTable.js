import React, { useState } from "react";
import "../../../../../App.css";

//pages
import SrutinyForm from "./ScrutinyForm";

//component
import TableComponent from "components/table/index";

//material-ui
import { Grid } from "@material-ui/core";

//icons


export default function AddUserTable() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [columns] = useState([
    { title: "Full Name", field: "index", width: "auto", filtering: true },
    {
      title: "Sign Block Name",
      field: "article",
      width: "auto",
      sorting: true,
    },
    { title: "Rank / Designation", field: "precedence", width: "auto" },
    { title: "Officiating as", field: "precedence", width: "auto" },
    { title: "Assign Authority", field: "precedence", width: "auto" },
    { title: "Privilege", field: "precedence", width: "auto" },
  ]);

  //   const fetchWOP = () => {
  //     setLoading(true);
  //     AxiosInstance.get(wopURL)
  //       .then(({ data: { data } }) => {
  //         setRecords(
  //           data
  //             .filter((item) => !item.deleted)
  //             .map((el, i) => ({ ...el, index: i + 1, article: el.article.name, precedence: el.title }))
  //         );
  //         setLoading(false);
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //         setLoading(false);
  //       });
  //   };

  //   useEffect(() => {
  //     fetchWOP();
  //   }, []);

  return (
    <>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          <SrutinyForm />
        </Grid>

        <Grid item xs={12} align='center'>
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=''
            // options={{ filtering: false, sorting: false }}
          />
        </Grid>
      </Grid>
    </>
  );
}
