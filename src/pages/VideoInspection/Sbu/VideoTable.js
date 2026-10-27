import { Button, CircularProgress, Container, makeStyles, IconButton, Table, TableBody, Dialog, DialogActions, TextField, Typography } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import INoteTable from "pages/InspectorModule/INote/INoteTable";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import TableComponent from "components/table/index";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { StyledTableCell, StyledTableRow } from "Utils";
import { DialogContent, DialogTitle } from "Utils";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { getAllCameraRequests, updateCameraRequest, getCameraRequestByEmpId } from "pages/Services/URLs";

//Styles
const useStyles = makeStyles({
	b: {
		border: "1px solid lightgrey",
	},
	success: {
		backgroundColor: "#a8e6cf", // Pale Green
		color: "#274930", // Dark Forest Green
	},
	error: {
		backgroundColor: "#f2d7d5", // Light Red
		color: "#493021", // Dark Maroon
	},

});
// VideoTable Component for displaying camera access request notifications
/* statusId : statusName = {1:Created, 2:Accepted, 3:Rejected}
 */
export default function VideoTable({ open, onClose }) { // Accept props here
	// console.log("VideoTable rendered");
	const [approve, setApprove] = useState(false);
	const classes = useStyles();
	const [records, setRecords] = useState([]);
	const [ipCamRecords, setIpCamRecords] = useState([]);
	const [reject, setReject] = useState(false);
	const [selectedRow, setSelectedRow] = useState();
	const [loading, setLoading] = React.useState(false);
	const loggedInUser = useSelector((store) => store.loggedInUser);
	const ORG_ID = loggedInUser.orgId;
	const actions = [
		{
			label: "Approve",
			icon: CheckCircleIcon,
			onClick: (event, rowData) => {
				setSelectedRow(rowData);
				setApprove(true);
				getCamerasByTest(rowData);
			},

		},
		{
			label: "Reject",
			icon: CancelIcon,
			onClick: (event, rowData) => {
				setSelectedRow(rowData);
				setReject(true);
			},

		},

	];
	{/* Below Columns define the table, only QC firm side employees can access Approve/Reject columns */ }
	const columns = useMemo(() => {
		// 1. Define the base columns
		const baseColumns = [
			{ title: "OL Number", field: "olId", width: "auto", filtering: true },
			{ title: "Test Name", field: "testName", width: "auto", filtering: true },
			{ title: "Date and Time", field: "dateTime", width: "auto", filtering: true },
			{ title: "Requested By", field: "requestedBy", width: "auto", filtering: true },
			{
				title: "Requested To", field: "requestedTo", width: "auto", filtering: true,
				render: (row) => row.notifiedUsers?.[0]?.notifiedUser || "N/A"
			},
			{ title: "Approved By", field: "approvedBy", width: "auto", filtering: true },
			{ title: "Status", field: "statusName", width: "auto", filtering: true },
		];

		// 2. Create the actions column
		const actionsColumn = {
			title: 'Actions',
			render: (rowData) => (
				<div style={{ display: 'flex', gap: '10px' }}>
					{actions.map((action, index) => (
						<Button
							key={index}
							variant="contained"
							color={action.label === 'Approve' ? 'success' : 'error'}
							startIcon={<action.icon />}
							onClick={(e) => action.onClick(e, rowData)}
							className={action.label === 'Approve' ? classes.success : classes.error}
							//disable button once request is approved/rejected
							disabled={rowData.statusId === 1 ? false : true}
						>
							{action.label}
						</Button>
					))}
				</div>
			)
		};

		// 3. Conditionally add the actions column
		// Only add it if ORG_ID is 2 i.e. OLF Firm
		if (ORG_ID === 2) {
			return [...baseColumns, actionsColumn];
		}
		//else return baseColumns only
		return baseColumns;
	}, [ORG_ID, actions]);

	const getData = async () => {
		try {
			setLoading(true);
			//if ORG_ID is 2 i.e. QC filter data for notifiedUserId
			//else filter data for empId
			const { data } = await axiosInstanceAte(getAllCameraRequests);
			setRecords(data);
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		getData();
	}, []);

	//Below functions are used to fetch camera details by test for current request

	const camColumns = [
		{ title: "IP Cam", field: "name", width: "auto", filtering: true },
		{ title: "IP Cam Address", field: "ip", width: "auto", filtering: true },
	]
	const getCamerasByTest = async (row) => {
		setLoading(true);
		try {
			const response = await axiosInstanceAte(`/sbuCameraMapping/getByIpList/${row.testId}`, {
				method: "GET",
			});
			const formattedData = Object.keys(response.data).map(ip => ({
				ip: ip,
				name: response.data[ip].name,
				url: response.data[ip].url
			}));
			setIpCamRecords(formattedData);
		} catch (error) {
			console.error(error);
			toast.error("Failed to fetch cameras for this request.");
		} finally {
			setLoading(false);
		}

	};

	function handleApprove() {
		setLoading(true);

		axiosInstanceAte.post(updateCameraRequest, {
			id: selectedRow.id,
			olId: selectedRow.olId,      // Use selectedRow
			testId: selectedRow.testId,  // Use selectedRow
			testName: selectedRow.testName, // Use selectedRow
			requestedBy: selectedRow.requestedBy,
			statusId: 2,
			approvedById: loggedInUser.empId,
			devId: selectedRow?.devId,
			olLiId: selectedRow?.olLiId
		})
			.then(() => {
				toast.success("Approved Successfully");
				getData();
				// onClose();
				setApprove(false);
			})
			.catch((e) => {
				console.log("failure " + e.response.data);
				toast.error("Something went wrong: " + e.response.data);
				setApprove(false);
			})
			.finally(() => {
				setLoading(false);
			});

	}
	function handleReject() {
		setLoading(true);
		axiosInstanceAte.post(updateCameraRequest, {
			id: selectedRow.id,
			olId: selectedRow.olId,      // Use selectedRow
			testId: selectedRow.testId,  // Use selectedRow
			testName: selectedRow.testName, // Use selectedRow
			requestedBy: selectedRow.requestedBy,
			statusId: 3,
			approvedById: loggedInUser.empId,
			devId: selectedRow?.devId,
			olLiId: selectedRow?.olLiId
		})
			.then(() => {
				toast.success("Rejected Successfully");
				getData();
				// onClose();
				setReject(false);
			})
			.catch((e) => {
				console.log(e);
				toast.error("Something went wrong: " + e.response.data);
				setReject(false);
			})
			.finally(() => {
				setLoading(false);
			});

	}


	return (
		<div>
			{/* Use the 'open' prop passed from parent */}
			<Dialog open={open} maxWidth="xl" fullWidth onClose={onClose}>
				<DialogTitle onClose={onClose}>
					VMS Request Detail
				</DialogTitle>


				<div>
					<TableComponent
						isLoading={loading}
						data={records}
						columns={columns}
						title=""
					// options={{ filtering: false, sorting: false }}
					/>
				</div>

			</Dialog>
			{/*Approve Button Dialog*/}
			<Dialog open={approve} maxWidth="lg" onClose={() => { setApprove(false) }} >

				<DialogContent>
					<Typography variant="h6">Approve access to following cameras? </Typography>
					<div>
						<TableComponent
							isLoading={loading}
							data={ipCamRecords}
							columns={camColumns}
							title=""
							options={{ filtering: false, sorting: false }}
						/>
					</div>

				</DialogContent>
				<DialogActions>
					<Button size="small" variant="contained" color="primary" onClick={handleApprove} >
						{approve && <CircularProgress size={24} />}
						YES
					</Button>
					<Button size="small" variant="contained" color="secondary" onClick={() => { setApprove(false) }}>
						NO
					</Button>
				</DialogActions>

			</Dialog>
			{/*Reject Button Dialog*/}

			<Dialog open={reject} maxWidth="xs" onClose={() => { setReject(false) }} >

				<DialogContent>
					<Typography variant="h6">Do you want to Reject ? </Typography>
				</DialogContent>
				<DialogActions>
					<Button size="small" variant="contained" color="primary" onClick={handleReject} >
						{reject && <CircularProgress size={24} />}
						YES
					</Button>
					<Button size="small" variant="contained" color="secondary" onClick={() => { setReject(false) }}>
						NO
					</Button>
				</DialogActions>

			</Dialog>
		</div>
	);
}
