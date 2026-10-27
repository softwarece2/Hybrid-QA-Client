/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import "../../../App.css";
import axiosInstance from "pages/Services/AxiosInstance";
import { getAllItemCategory } from "pages/Services/URLs";
import ItemCategoryForm from "./ItemCategoryForm";
import ActionButton from "components/ActionButton";
import Active from "components/Active";
import InActive from "components/InActive";
import TableComponent from "components/table/index";
import { Grid } from "@material-ui/core";

//icons
import EditIcon from "@material-ui/icons/Edit";


export default function ItemCategoryTable() {
   
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemCatObj, setitemCatObj] = useState({});

    const [columns] = useState([
        {
            title: "Item Category",
            field: "category",
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
   

    const fetchItemCategory = () => {
        setLoading(true);
        axiosInstance
            .get(getAllItemCategory)
            .then(({ data }) => {
                setRecords(
                    data.map((el, i) => ({
                        ...el,

                        itemCatStatusValue: el?.active,
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
        fetchItemCategory();
    }, []);

    return (
        <>
            <Grid container spacing={2} alignItems="center" align="center">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                    <ItemCategoryForm fetch={fetchItemCategory} itemCatDetails={itemCatObj} records={records} />
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
                                        active: rowData?.itemCatStatusValue ? "true" : "false",
                                    };
                                    setitemCatObj(data);
                                    console.log("itemCatObj", data);
                                },
                            },
                        ]}
                    />
                </Grid>
            </Grid>
        </>
    );
}
