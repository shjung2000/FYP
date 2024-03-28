import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    Typography,
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    Paper,
    Button,
} from "@mui/material";
import "./IndividualReservation.css";

const changeTimeFormat = (time) => {
    let hour = time.slice(0, 2);
    let minute = time.slice(2);

    if (hour === "13") {
        hour = "1:";
    } else if (hour === "14") {
        hour = "2:";
    } else if (hour === "15") {
        hour = "3:";
    } else if (hour === "16") {
        hour = "4:";
    } else if (hour === "17") {
        hour = "5:";
    } else if (hour === "18") {
        hour = "6:";
    } else if (hour === "19") {
        hour = "7:";
    } else if (hour === "20") {
        hour = "8:";
    } else if (hour === "21") {
        hour = "9:";
    } else if (hour === "22") {
        hour = "10:";
    } else {
        hour = "12:";
    }

    let newString = hour + minute + "PM";
    return newString;
};

const IndivdualReservation = ({ readOnly = true, reservationId }) => {
    // deleting
    // true (have delete button)
    // false (view only)

    const [loading, setLoading] = useState(true);
    // 2 successes --> loading & deleting
    // load success --> to retrive reservation
    const [loadSuccess, setLoadSuccess] = useState(false);
    // delete success --> to delete reservation
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const [triggeredDelete, setTriggeredDelete] = useState(false);
    const [reservation, setReservation] = useState(null);

    // 2 key requests
    // find reservation
    const getReservationById = async () => {
        console.log(`${process.env.REACT_APP_BACKEND_URL}reservation/${reservationId}`)
        await axios
            .get(
                `${process.env.REACT_APP_BACKEND_URL}reservation/${reservationId}`
            )
            .then((result) => {
                console.log(result);
                setReservation(result.data);
                setLoading(false);
                setLoadSuccess(true);
            })
            .catch((err) => {
                setLoading(false);
                setLoadSuccess(false);
            });
    };
    // delete reservation (trigggerd by confirmation)
    const cancelReservation = async () => {
        await axios
            .delete(
                `${process.env.REACT_APP_BACKEND_URL}reservation/${reservationId}`
            )
            .then(() => {
                setTriggeredDelete(true);
                setDeleteSuccess(true);
            })
            .catch(() => {
                setTriggeredDelete(false);
                setDeleteSuccess(false);
                alert("Failed to delete. Please try again later.");
            });
    };
    useEffect(() => {
        getReservationById();
    }, []);
    return (
        <Card
            sx={{
                margin: "10px auto",
                padding: "10px",
                width: {
                    xs: "100vw",
                    sm: "80vw",
                    md: "70vw",
                    lg: "50vw",
                },
                background: "black",
                color: "white",
            }}
        >
            {loading ? (
                <>
                    <h1>Loading ...</h1>
                </>
            ) : (
                <>
                    {loadSuccess && !triggeredDelete ? (
                        <>
                            <Typography variant="h4">
                                {!readOnly?<>Cancel Reservation</>:<>View Reservation</>}
                                
                            </Typography>
                            <Typography variant="h5">
                                Below contains the details of your current
                                Reservation
                            </Typography>
                            <TableContainer
                                component={Paper}
                                sx={{ margin: "10px auto" }}
                            >
                                <Table>
                                    <TableBody>
                                        {/* name */}
                                        <TableRow>
                                            <TableCell align="right">
                                                Customer Name
                                            </TableCell>
                                            <TableCell align="left">
                                                {reservation.name}
                                            </TableCell>
                                        </TableRow>

                                        {/* reference ID */}
                                        <TableRow>
                                            <TableCell align="right">
                                                Reference ID
                                            </TableCell>
                                            <TableCell align="left">
                                                {reservation._id}
                                            </TableCell>
                                        </TableRow>

                                        {/* reference ID */}
                                        <TableRow>
                                            <TableCell align="right">
                                                Reservation Date and Time
                                            </TableCell>
                                            <TableCell align="left">
                                                {reservation.date_of_visit} {changeTimeFormat(reservation.time)}
                                            </TableCell>
                                        </TableRow>

                                        {/* pax */}
                                        <TableRow>
                                            <TableCell align="right">
                                                Pax
                                            </TableCell>
                                            <TableCell align="left">
                                                {reservation.pax}
                                            </TableCell>
                                        </TableRow>

                                        {/* phone number */}
                                        <TableRow>
                                            <TableCell align="right">
                                                Phone Number
                                            </TableCell>
                                            <TableCell align="left">
                                                {reservation.phone}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {!readOnly ? (
                                <>
                                    {" "}
                                    <Typography variant="h6">
                                        Are you sure you want to delete your
                                        reservation? This cannot be undone.
                                    </Typography>
                                    <Button
                                        variant="filled"
                                        sx={{
                                            background: "#F49300",
                                            display: "flex",
                                            margin: "10px auto",
                                            padding: "5px",
                                            width: "50%",
                                        }}
                                        onClick={() => {
                                            cancelReservation();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            margin: "10px auto",
                                            padding: "5px",
                                            width: "100%",
                                        }}
                                        textAlign="center"
                                    >
                                        Close this tab to cancel
                                    </Typography>
                                </>
                            ) : (
                                <></>
                            )}
                        </>
                    ) : (
                        <></>
                    )}
                    {!loadSuccess && !triggeredDelete ? (
                        <>
                            {" "}
                            <Typography variant="h4">
                                Reservation not found.
                            </Typography>
                        </>
                    ) : (
                        <></>
                    )}

                    {triggeredDelete && deleteSuccess ? (
                        <>
                            <Typography variant="h4">
                                Deleted successfully. You may close this tab
                            </Typography>
                        </>
                    ) : (
                        <></>
                    )}
                </>
            )}
        </Card>
    );
};

export default IndivdualReservation;
