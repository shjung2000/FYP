import React, { useState } from "react";
import {
    TableCell,
    TableRow,
    Button,
    TextField,
    Grid,
    FormControl,
    Select,
    MenuItem,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

function LabourRow({ employeeInfo, editEmployeeInfo, deleteEmployeeInfo }) {
    // =============================props=============================
    // employeeInfo -> the employee object
    // editEmployeeInfo -> the method to update the employee record
    // deleteEmployeeInfo -> the method to delete the employee record
    const { _id, name, work_duration, status, employeeId, date } = employeeInfo;

    // =============================constants=============================
    const employeeStatusDict = {
        P: "Part Time",
        F: "Full Time",
    };
    const ErrorMessage = styled(Typography)({
        color: "red",
        textAlign: "left",
        fontSize: 15,
        "& .MuiTypography-root": {
            margin: "0px",
        },
    });

    // =============================states=============================
    const [isEditing, setIsEditing] = useState(false);

    // record data
    const [currName, setCurrName] = useState(name);
    const [currDuration, setCurrDuration] = useState(work_duration);
    const [currStatus, setCurrStatus] = useState(status);

    // errors
    const [nameError, setNameError] = useState("");
    const [durationError, setDurationError] = useState("");
    const [statusError, setStatusError] = useState("");

    // =============================functions=============================
    const resetChanges = () => {
        setCurrName(name);
        setCurrDuration(work_duration);
        setCurrStatus(status);

        setNameError("");
        setDurationError("");
        setStatusError("");
        setIsEditing(false);
    };

    const saveChanges = async () => {
        var errorCount = 0;
        // validate name, duration, status
        // name cant be empty
        if (!currName) {
            errorCount += 1;
            setNameError("Name cannot be empty");
        } else {
            setNameError("");
        }
        // duration cannot be 0 or less
        if (currDuration <= 0) {
            errorCount += 1;
            setDurationError("Duration cannot below 0");
        } else {
            setDurationError("");
        }
        // status cannot be -
        if (currStatus == "-") {
            errorCount += 1;
            setStatusError("Invalid work type");
        } else {
            setStatusError("");
        }
        if (errorCount == 0) {
            // alert("Thank you Sanghil for your magic!");
            // call the create function
            const employeeInfo = {
                name: currName,
                date,
                work_duration: currDuration,
                status: currStatus,
            };
            await editEmployeeInfo(_id, employeeInfo);
            setIsEditing(false);
        }
    };

    const deleteEmployeeRow = async () => {
        let confirmation = prompt(
            "Are you sure you want to delete? This is irreversible! Type 'y' to proceed."
        );
        if (confirmation == "y") {
            await deleteEmployeeInfo(_id);
        }
    };

    return (
        <TableRow>
            <TableCell component="th" scope="row" align="left">
                {isEditing ? (
                    <>
                        {" "}
                        <TextField
                            sx={{ width: "100%" }}
                            value={currName}
                            onChange={(e) => {
                                setCurrName(e.target.value);
                            }}
                            placeholder={"Add Employee Name"}
                        />
                        <ErrorMessage sx={{ ml: 1, mt: 0 }}>
                            {nameError}
                        </ErrorMessage>
                    </>
                ) : (
                    <>{currName}</>
                )}
            </TableCell>
            <TableCell align="left">
                {isEditing ? (
                    <>
                        <TextField
                            type={"number"}
                            min={0}
                            sx={{ width: "100%" }}
                            value={currDuration}
                            onChange={(e) => {
                                setCurrDuration(e.target.value);
                            }}
                            placeholder={"Work Duration"}
                        />
                        <ErrorMessage sx={{ ml: 1, mt: 0 }}>
                            {durationError}
                        </ErrorMessage>
                    </>
                ) : (
                    <>{currDuration}</>
                )}
            </TableCell>
            <TableCell align="left">
                {isEditing ? (
                    <>
                        <FormControl fullWidth>
                            <Select
                                sx={{ width: "100%" }}
                                value={currStatus}
                                onChange={(e) => setCurrStatus(e.target.value)}
                            >
                                <MenuItem value={"-"}>Selct Category</MenuItem>
                                <MenuItem value={"P"}>Part Time</MenuItem>
                                <MenuItem value={"F"}>Full time</MenuItem>
                            </Select>
                        </FormControl>
                        <ErrorMessage sx={{ ml: 1, mt: 0 }}>
                            {statusError}
                        </ErrorMessage>
                    </>
                ) : (
                    <>{employeeStatusDict[currStatus]}</>
                )}
            </TableCell>
            <TableCell align="left">
                <Grid container>
                    {isEditing ? (
                        <>
                            <Grid
                                item
                                xs={6}
                                sx={{
                                    margin: "auto",
                                    display: "flex",
                                    justifyContent: "middle",
                                }}
                            >
                                <Button
                                    sx={{
                                        color: "black",
                                        margin: "auto",
                                        background: "#e79600",
                                        transition:
                                            "background 0.5s, color 0.5s",
                                        "&:hover": {
                                            background: "#b17200",
                                            color: "white",
                                        },
                                    }}
                                    onClick={() => {
                                        saveChanges();
                                    }}
                                >
                                    Save
                                </Button>
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                sx={{
                                    margin: "auto",
                                    display: "flex",
                                    justifyContent: "middle",
                                }}
                            >
                                <Button
                                    sx={{
                                        color: "white",
                                        margin: "auto",
                                        background: "grey",
                                        transition:
                                            "background 0.5s",
                                        "&:hover": {
                                            background: "#494848",
                                        },
                                    }}
                                    onClick={() => {
                                        resetChanges();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Grid
                                item
                                xs={6}
                                sx={{
                                    margin: "auto",
                                    display: "flex",
                                    justifyContent: "middle",
                                }}
                            >
                                <Button
                                    variant="filled"
                                    sx={{
                                        color: "black",
                                        margin: "auto",
                                        background: "#e79600",
                                        transition:
                                            "background 0.5s, color 0.5s",
                                        "&:hover": {
                                            background: "#b17200",
                                            color: "white",
                                        },
                                    }}
                                    onClick={() => {
                                        setIsEditing(true);
                                    }}
                                >
                                    Edit
                                </Button>
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                sx={{
                                    margin: "auto",
                                    display: "flex",
                                    justifyContent: "middle",
                                }}
                            >
                                <Button
                                    variant="filled"
                                    sx={{
                                        color: "white",
                                        margin: "auto",
                                        background: "#c80e0e",
                                        transition: "background 0.5s",
                                        "&:hover": {
                                            background: "#970000",
                                        },
                                    }}
                                    onClick={() => {
                                        deleteEmployeeRow();
                                    }}
                                >
                                    Delete
                                </Button>
                            </Grid>
                        </>
                    )}
                </Grid>
            </TableCell>
        </TableRow>
    );
}

export default LabourRow;
