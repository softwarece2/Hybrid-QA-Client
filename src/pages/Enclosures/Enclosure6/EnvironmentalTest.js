/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../App.css";

//component
import TableComponent from "components/table/index";
import AxiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";
import { getInspectOLUrl } from "pages/Services/URLs";

//material-ui
import { Grid} from "@material-ui/core";
import { useDispatch } from "react-redux";

import Button from "components/Button";
import { selectItem } from "Redux/Actions/SelectTreeItem";

import TestRequestReview from "pages/Enclosures/Enclosure6/TestRequestReview";




export default function EnvironmentalTest() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state?.loggedInUser);

  const [columns] = useState([
    { title: "SO Number ", field: "name", width: "auto" },
    { title: "SBU", field: "soNumber", width: "auto" },
    { title: "Project Name", field: "projectName", width: "auto" },
    { title: "Env Request NO", field: "Env Request NO", width: "auto" },
    { title: "Date and Time", field: "sbuName", width: "auto", sorting: true },

    { title: "Status", field: "precedence", width: "auto", filtering: false },
    { title: "Review", field: "Review", width: "auto", filtering: false },

    {
      title: "Actions",
      field: "precedence",
      width: "auto",
      filtering: false,
      sorting: false,
    },
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
  //   useEffect(() => {
  //     fetch();

  //  }, []);
  //  const fetch = async () => {
  //    return dispatch(getInspectOL).then((res) => {
  //      setRecords(res);
  //    });
  //  };
  const getInspectOL = () => {
    setLoading(true);
    AxiosInstanceTransaction.get(getInspectOLUrl + loggedInUser?.empId)
      .then(({ data }) => {
        setRecords(
          data.map((el, i) => ({
            ...el,
            Review: (
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                style={{ align: "right" }}
                onClick={() => dispatch(selectItem(<TestRequestReview />))}
              >
                {" "}
                Enclosure6
              </Button>
            ),
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
    getInspectOL();
    console.log("inside sbu so import");
  }, []);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            // options={{ filtering: false, sorting: false }}
          />
        </Grid>
      </Grid>
    </>
  );
}
