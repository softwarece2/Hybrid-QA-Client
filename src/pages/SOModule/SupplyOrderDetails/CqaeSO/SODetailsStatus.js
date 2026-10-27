import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";

//material-ui
import Card from "@material-ui/core/Card";
import { CardHeader, Grid, CardContent } from "@material-ui/core";

//components
import TextField from "../../../../components/TextField";
import moment from "moment";

//pages
import DeliveryDate from "../DialogForms/DeliveryDate/DeliveryDateDialog";
import Amendments from "../DialogForms/Amendments/AmendmentsDialog";
import ItemLotsTable from "pages/SOModule/ItemLots/ItemLotsTable";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    height: 10,
  },
  cardTitle: {
    fontSize: "0.875rem",
  },
  cardContent: {
    textAlign: "left",
    padding: 16,
    // backgroundColor: "#C7D7B8",
  },
  cardContent1: {
    textAlign: "left",
    padding: 16,
    backgroundColor: "#C7D7B8",
  },
  cardContent2: {
    textAlign: "left",
    padding: 16,
    backgroundColor: "#FFC090",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  spacing: {
    padding: "0px 12px 0px 12px",
  },
}));

export default function SODetailsStatus({ soObj, getSoBySoId }) {
  const classes = useStyles();
  const [itemLotno, setItemLotno] = useState(null);
  const [itemLotDate, setItemLotDate] = useState(null);
  const [ddLetterNo, setddLetterNo] = useState(null);
  const [ddLetterDate, setDdLetterDate] = useState(null);
  const [amendment, setAamendment] = useState(null);

  useEffect(() => {
    const sortedItemLots = _.sortBy(soObj?.itemLots, ["ilLetterDate"]);
    const latestItemLot = sortedItemLots[soObj?.itemLots?.length - 1];
    console.log("latestItemLot", latestItemLot);
    setItemLotno(latestItemLot?.lotNo);
    setItemLotDate(latestItemLot?.ilLetterDate);
    const sortedExtension = _.sortBy(soObj?.ddExtensions, ["newDdDate"]);
    const latestddExtensions = sortedExtension[soObj?.ddExtensions?.length - 1];
    setddLetterNo(latestddExtensions?.letterNo);
    setDdLetterDate(latestddExtensions?.newDdDate);
    const sortedamendment = _.sortBy(soObj?.amendmentsLetters);
    const latestamendment =
      sortedamendment[soObj?.amendmentsLetters?.length - 1];
    setAamendment(latestamendment?.amendments);
    console.log("latestddExtensions", latestddExtensions);
    console.log("latestamendment", latestamendment);
  }, [soObj]);

  return (
    <div align="center">

      <Grid container spacing={2}>
        {/* ..............card2............... */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className={classes.spacing}
        >
          <Card className={classes.card}>
            <CardHeader
              classes={{
                root: classes.cardHeader,
                title: classes.cardTitle,
              }}
              style={{ textAlign: "left" }}
              title="Item Lots"
            />
            <CardContent className={classes.cardContent}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    labelText="Lot Number"
                    //placeholder="Lot Number""
                    value={itemLotno || ''}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={1} alignContent="center">
                  <ItemLotsTable getSoBySoId={getSoBySoId} />
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    labelText="Letter Date"
                    //placeholder="Enter Password"
                    type="date"
                    value={itemLotDate?moment(itemLotDate).format("YYYY-MM-DD"):""}
                    //value={itemLotDate}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/* ..............card3............... */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className={classes.spacing}
        >
          <Card className={classes.card}>
            <CardHeader
              classes={{
                root: classes.cardHeader,
                title: classes.cardTitle,
              }}
              style={{ textAlign: "left" }}
              title="Delivery Date"
            />
            <CardContent className={classes.cardContent}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    labelText="DD Extension"
                    //placeholder="Enter Password"
                  value={ddLetterNo || ""}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={1} alignContent="center">
                  <DeliveryDate getSoBySoId={getSoBySoId} />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    labelText="Last Delivery Date"
                    //placeholder="Enter Password"
                    type="date"
                    value={ddLetterDate?moment(ddLetterDate).format("YYYY-MM-DD"):""}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

       

        {/* ..............card5............... */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className={classes.spacing}
        >
          <Card className={classes.card}>
            <CardHeader
              classes={{
                root: classes.cardHeader,
                title: classes.cardTitle,
              }}
              style={{ textAlign: "left" }}
              title="Amendments"
            />
            <CardContent className={classes.cardContent}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    labelText="Any Amendments"
                    value={amendment || ""}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} alignContent="center">
                  <Amendments getSoBySoId={getSoBySoId} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* </Card> */}
    </div>
  );
}
