/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { makeStyles} from "@material-ui/core/styles";
import { CallEndRounded, VideoCallRounded } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Checkbox,
  Grid,
  InputLabel,
  TextField,
} from "@material-ui/core";
import VideoStreamLayout from "../VideoStreamLayout";
import Button from "components/Button";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Controller, useForm } from "react-hook-form";
import { getInspectors } from "Redux/Actions/SupplyOrder/SOAction";
import { Autocomplete } from "@material-ui/lab";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { TRANSACTION_URL } from "config";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      display: "flex",
      justifyContent: "center",
    },
  },
  fab: {
    backgroundColor: theme.palette.primary.dark,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  icon: {
    color: theme.palette.primary.contrastText,
  },
  box: {
    display: "flex",
    justifyContent: "space-between",
  },
  infoCard: {
    display: "flex",
    justifyContent: "center",
  },
  btn: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.primary.contrastText,
      background: theme.palette.primary.dark,
    },
  },
  backbtn: {
    marginTop: "10px",
    marginLeft: "10px",
  },
  asterisk: {
    color: theme.palette.error.light,
  },
  roor: {
    color: theme.palette.text.primary,
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
  },
  textFieldRoot: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    // height: 44,
  },
}));

export default function VideoInspectionByInspector(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { v4: uuidv4 } = require("uuid");
  const [openVideo, setOpenVideo] = useState(false);

  const inspectorData = useSelector(
    (store) => store.soReducer.inspectorDetails
  );
  const empName = useSelector((state) => state?.loggedInUser?.ename);

  const [meetingId, setMeetingId] = useState(null);

  const defaultValues = { participants: [] };
 

  const {
   
    control,
    
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    // resolver: yupResolver(schema),
    mode: "onChange",
  });
  useEffect(() => {
    dispatch(getInspectors());
  }, []);

  console.log("getValues", getValues());

  const onClickHandler = () => {
    // Generate a random UUID as meetingId
    const random_uuid = uuidv4();
    setMeetingId(random_uuid);
    const sendMeetingLinkUrl =
      TRANSACTION_URL +
      `remoteInspection/sendLink?meetingId=${random_uuid}&empName=${empName}`;
    axiosInstance.post(sendMeetingLinkUrl, getValues("participants"));
    setOpenVideo(true);
    window.scrollBy(0, 250);
  };

  return (
    <div className={classes.root}>
      <Box>
        <Grid container spacing={2}>
          {/* <Grid item xs={12} sm={12} md={12} lg={8} xl={6}> */}
          <Grid item xs={12} sm={10} md={8} lg={4}>
            <Controller
              name="participants"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <>
                    <InputLabel
                      classes={{
                        asterisk: classes.asterisk,
                        root: classes.roor,
                      }}
                      style={{ fontSize: "0.875rem" }}
                      required={true}
                    >
                      {"Select Participants"}
                    </InputLabel>
                    <Autocomplete
                      multiple
                      options={inspectorData}
                      value={
                        inspectorData?.filter((item) =>
                          value?.includes(item?.id)
                        ) || ""
                      }
                      onChange={(e, v) => {
                        const data = v?.map((item) => item?.id);
                        onChange(data);
                      }}
                      labelText="Select Inspector"
                      getOptionLabel={(o) => o.ename}
                      disableCloseOnSelect
                      disabled={openVideo}
                      // filterSelectedOptions
                      renderOption={(inspectorData, { selected }) => (
                        <React.Fragment>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8, height: "20px" }}
                            checked={selected}
                            color="primary"
                          />
                          {inspectorData.ename}
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          variant="outlined"
                          {...params}
                          // InputProps={{
                          //     ...params.InputProps,
                          //     classes: {
                          //         input: classes.input,
                          //         root: classes.textFieldRoot,
                          //     },
                          // }}
                          size="small"
                          error={!!errors.consigneeIds}
                          helperText={errors.consigneeIds?.message}
                        />
                      )}
                    />
                  </>
                );
              }}
            />
          </Grid>
          {/* </Grid> */}
          <Grid item xs={12} sm={12} md={8} lg={11}>
            {/* {openVideo&& (
                            <VideoStreamInspector
                                meetId="112"
                            // isOnline={patientDetails?.isTeleConsultation}
                            />

                        )} */}
            {openVideo === false ? (
              <>
                {" "}
                <Button
                  onClick={onClickHandler}
                  startIcon={<VideoCallRounded />}
                  className={classes.btn}
                  variant="contained"
                  disabled={getValues("participants").length == 0}
                >
                  Start Inspection
                </Button>{" "}
              </>
            ) : (
              <>
                <Button
                  onClick={() => setOpenVideo(false)}
                  startIcon={<CallEndRounded />}
                  color="secondary"
                  variant="contained"
                >
                  End Call
                </Button>
              </>
            )}
            {openVideo && <VideoStreamLayout meetingId={meetingId} />}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
