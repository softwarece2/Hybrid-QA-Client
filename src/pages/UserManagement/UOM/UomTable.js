/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import "../../../App.css";

//pages
import axiosInstance from "pages/Services/AxiosInstance";
import { getAllUom } from "pages/Services/URLs";
import UomForm from "./UomForm";

//component
import ActionButton from "components/ActionButton";
import Active from "components/Active";
import InActive from "components/InActive";
import TableComponent from "components/table/index";

//material-ui
import { Grid} from "@material-ui/core";

//icons
import EditIcon from "@material-ui/icons/Edit";


export default function UomTable() {
    
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uomObj, setuomObj] = useState({});

    const [columns] = useState([
        {
            title: "Unit",
            field: "unit",
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
   

    const fetchUom = () => {
        setLoading(true);
        axiosInstance
            .get(getAllUom)
            .then(({ data }) => {
                setRecords(
                    data.map((el, i) => ({
                        ...el,

                        uomStatusValue: el?.active,
                        active: el?.active == true ? <Active /> : el?.active == false ? <InActive /> : null,
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
        fetchUom();
    }, []);

    return (
        <>
            <Grid container spacing={2} alignItems="center" align="center">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                    <UomForm fetch={fetchUom} uomDetails={uomObj} records={records} />
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
                                        active: rowData?.uomStatusValue ? "true" : "false",
                                    };
                                    setuomObj(data);
                                    console.log("uomObj", data);
                                },
                            },
                        ]}
                    />
                </Grid>
            </Grid>
        </>
    );
}
