import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { TableCell, TableRow, TableContainer, TableHead } from "@mui/material";
import axios from "axios";
import {
    Grid,
    TextField,
    Typography,
    Select,
    MenuItem,
    Button,
    FormControl,
    Modal,
    Box,
    Paper,
    LinearProgress,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import LabourRow from "./LabourRow";

function createData(name, duration, status) {
    return { name, duration, status };
}

const rows = [createData("SangHil", 7, "P")];

const ErrorMessage = styled(Typography)({
    color: "red",
    textAlign: "left",
    fontSize: 15,
    "& .MuiTypography-root": {
        margin: "0px",
    },
});

export default function CustomizedTables() {
    // =============================states=============================
    const [loading, setLoading] = useState(false);

    const todayDate = dayjs();
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("-");
    const [order, setOrder] = useState(0); //0 for n/a, 1 for ascending, 2 for descending

    // for the modal
    const [openModal, setOpenModal] = useState(false);
    const [workDesignation, setWorkDesignation] = useState("-"); //P means part time, F means fulltime
    const [employeeName, setEmployeeName] = useState("");
    const [hoursWorked, setHoursWorked] = useState(0);

    // for the validation
    const [nameError, setNameError] = useState("");
    const [durationError, setDurationError] = useState("");
    const [workDesignationError, setWorkDesignationError] = useState("");

    // =============================functions=============================
    const resetFields = () => {
        setHoursWorked(0);
        setEmployeeName("");
        setWorkDesignation("-");

        setNameError("");
        setDurationError("");
        setWorkDesignationError("");
        setOpenModal(false);
    };
    const extractDate = (dayJsObject) => {
        const { $y, $M, $D } = dayJsObject;
        var year = $y.toString();
        var month = ($M + 1).toString();
        if (month.length == 1) {
            month = "0" + month;
        }
        var day = $D.toString();
        if (day.length == 1) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day;
    };

    // ========GET method========
    const getEmployees = async () => {
        // link backend
        // console.log(extractDate(currentDate));
        // setLoading(true);
        // console.log("sending axios post")
        await axios
            .post(
                `${process.env.REACT_APP_BACKEND_URL}employee/getEmployeeByDate`,
                {
                    date: extractDate(currentDate),
                }
            )
            .then((res) => {
                // console.log("loading, axios post alr made")
                setEmployees(res.data);
                setLoading(false);
            });
    };

    // ========POST method========
    const addEmployeeRecord = async () => {
        var errorCount = 0;
        // validate name, duration, status
        // name cant be empty
        if (!employeeName) {
            errorCount += 1;
            setNameError("Name cannot be empty");
        } else {
            setNameError("");
        }
        // duration cannot be 0 or less
        if (hoursWorked <= 0) {
            errorCount += 1;
            setDurationError("Duration cannot be below 0");
        } else {
            setDurationError("");
        }
        // status cannot be -
        if (workDesignation == "-") {
            errorCount += 1;
            setWorkDesignationError("Invalid work type");
        } else {
            setWorkDesignationError("");
        }
        if (errorCount == 0) {
            await axios
                .post(
                    `${process.env.REACT_APP_BACKEND_URL}employee/addEmployee`,
                    {
                        name: employeeName,
                        duration: hoursWorked,
                        type: workDesignation,
                        date: extractDate(currentDate),
                    }
                )
                .then(async (res) => {
                    alert("Employee successfully added!");
                    resetFields();
                    await getEmployees();
                });
        }
    };

    // ========PUT(update) method========
    const editEmployeeRecord = async (employeeRecordId, employeeInfo) => {
        // call the edit employee record (connect to backend)
        await axios
            .put(
                `${process.env.REACT_APP_BACKEND_URL}employee/updateEmployee/${employeeRecordId}`,
                employeeInfo
            )
            .then(async (res) => {
                alert("Employee successfully updated!");
                resetFields();
                await getEmployees();
            });
    };

    // ========DELETE method========
    const deleteEmployeeRecord = async (employeeRecordId) => {
        // call the delete employee record (connect to backend)
        await axios
            .delete(
                `${process.env.REACT_APP_BACKEND_URL}employee/deleteEmployee/${employeeRecordId}`
            )
            .then(async (res) => {
                alert("Employee successfully deleted!");
                resetFields();
                await getEmployees();
            });
        // await getEmployees();
    };

    // ====================useEffect====================
    useEffect(() => {
        getEmployees();
    }, [currentDate]);

    return (
        <>
            {/* for button & filters */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={6} alignContent={"middle"}>
                    <Typography variant="subtitle1">Pick a Date</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            minDate={todayDate}
                            value={currentDate}
                            onChange={setCurrentDate}
                            format="YYYY/MM/DD"
                            textField={(params) => <TextField {...params} />}
                            InputAdornmentProps={{
                                position: "start",
                            }}
                            sx={{ width: "100%" }}
                        />
                    </LocalizationProvider>
                </Grid>
                {/* add button */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    alignContent={"middle"}
                    sx={{
                        margin: "auto",
                    }}
                >
                    <Button
                        onClick={() => {
                            setOpenModal(true);
                        }}
                        sx={{
                            margin: "0 auto",
                            backgroundColor: "#F49300",
                            fontWeight: "bold",
                            color: "black",
                            borderRadius: "5px",
                            ":hover": {
                                backgroundColor: "black",
                                color: "#F49300",
                            },
                        }}
                    >
                        Add Session
                    </Button>
                </Grid>
            </Grid>

            {/* for table */}
            <TableContainer component={Paper} sx={{ margin: "10px auto" }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Duration (hours)</TableCell>
                            <TableCell align="left">
                                Employment Status
                            </TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Box>
                                        <Typography
                                            variant={"h6"}
                                            textAlign="center"
                                        >
                                            Loading
                                        </Typography>
                                        <LinearProgress
                                            color="secondary"
                                            sx={{
                                                backgroundColor:
                                                    "rgb(244, 147, 0, 0.4)",
                                                "& .MuiLinearProgress-bar": {
                                                    backgroundColor:
                                                        "rgb(197, 119, 2 )",
                                                },
                                            }}
                                        />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <>
                                {employees.length == 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Typography
                                                variant={"h6"}
                                                textAlign="center"
                                            >
                                                No records available
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <>
                                        {employees.map((row) => {
                                            const { _id } = row;
                                            return (
                                                <LabourRow
                                                    key={_id}
                                                    employeeInfo={row}
                                                    editEmployeeInfo={
                                                        editEmployeeRecord
                                                    }
                                                    deleteEmployeeInfo={
                                                        deleteEmployeeRecord
                                                    }
                                                />
                                            );
                                        })}
                                    </>
                                )}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                open={openModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "30vw",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        pt: 2,
                        px: 4,
                        pb: 3,
                    }}
                >
                    <Typography id="modal-modal-title" variant="h4">
                        Add Entry
                    </Typography>
                    <Typography id="modal-modal-title" variant="subtitle1">
                        Employee Name
                    </Typography>
                    <TextField
                        sx={{ width: "100%" }}
                        value={employeeName}
                        onChange={(e) => {
                            setEmployeeName(e.target.value);
                        }}
                        placeholder={"Add Employee Name"}
                    />
                    <ErrorMessage sx={{ ml: 1, mt: 0 }}>
                        {nameError}
                    </ErrorMessage>
                    <Typography id="modal-modal-title" variant="subtitle1">
                        Work Duration (Hours)
                    </Typography>
                    <TextField
                        type={"number"}
                        min={0}
                        sx={{ width: "100%" }}
                        value={hoursWorked}
                        onChange={(e) => {
                            setHoursWorked(e.target.value);
                        }}
                        placeholder={"Work Duration"}
                    />
                    <ErrorMessage sx={{ ml: 1, mt: 0 }}>
                        {durationError}
                    </ErrorMessage>
                    <Typography variant="subtitle1">Employment Type</Typography>
                    <FormControl fullWidth>
                        <Select
                            sx={{ width: "100%" }}
                            value={workDesignation}
                            onChange={(e) => setWorkDesignation(e.target.value)}
                        >
                            <MenuItem value={"-"}>Selct Category</MenuItem>
                            <MenuItem value={"P"}>Part Time</MenuItem>
                            <MenuItem value={"F"}>Full time</MenuItem>
                        </Select>
                    </FormControl>
                    <ErrorMessage sx={{ ml: 1, mt: 0 }}>
                        {workDesignationError}
                    </ErrorMessage>
                    <Grid
                        container
                        rowSpacing={1}
                        sx={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                        <Grid
                            item
                            xs={6}
                            alignContent={"center"}
                            sx={{ display: "flex" }}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    margin: "0 auto",
                                    backgroundColor: "black",
                                    fontWeight: "bold",
                                    color: "#F49300",
                                    ":hover": {
                                        backgroundColor: "#F49300",
                                        color: "black",
                                    },
                                }}
                                onClick={() => {
                                    resetFields();
                                }}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            alignContent={"middle"}
                            sx={{ display: "flex" }}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    margin: "0 auto",
                                    backgroundColor: "#F49300",
                                    fontWeight: "bold",
                                    color: "black",
                                    ":hover": {
                                        backgroundColor: "black",
                                        color: "#F49300",
                                    },
                                }}
                                onClick={() => {
                                    addEmployeeRecord();
                                }}
                            >
                                Add Log
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
}
