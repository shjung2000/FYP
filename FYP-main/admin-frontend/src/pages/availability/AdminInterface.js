import React, { useState, useRef, useEffect } from "react";
import "./AdminInterface.css";
import "./TableAvailability.css";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Container } from "@mui/system";
import Typography from "@mui/material/Typography";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import { CSVLink, CSVDownload } from "react-csv";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ReservationTableLayout from "../../components/reservations/ReservationTableLayout";
import Modal from "../../components/reservations/Modal/Modal";
import Delete from "../../components/reservations/Delete/Delete";

import dayjs from "dayjs";
function refreshPage() {
    window.location.reload();
}

function AdminInterface() {
    // =========================stylings=========================
    
    useEffect(() => {
        fetch(
            `${process.env.REACT_APP_BACKEND_URL}reservation/getAllTimingList`,
            {
                crossDomain: true,
                method: "POST",
                body: JSON.stringify({}),
                headers: { "Content-Type": "application/json" },
            }
        )
            .then((res) => res.json())
            .then((response) => {
                if(response[0].slice(2 , 4) === "00"){
                    setDisplayTime(parseInt(response[0]));
                    setStartTime(parseInt(response[0]));
                }else if(response[0].slice(2 , 4) === "30"){
                    setDisplayTime(parseInt(response[0]) + 20);
                    setStartTime(parseInt(response[0]) + 20);
                }
                if(response[response.length-1].slice(2 , 4) === "00"){
                    setEndTime(parseInt(response[response.length-1]));
                }else if(response[response.length -1].slice(2 , 4) === "30"){
                    setEndTime(parseInt(response[response.length-1]) + 20);
                }
            })
            .catch((error) => {
                console.error("Error", error);
            });
    } , []);
    
    
    
    
    
    
    const floatImages = {
        // width: 50,
        height: 46,
        float: "left",
        marginRight: 15,
    };
    const [csvData, setData] = useState([]);
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BACKEND_URL}reservation/`)
            .then((res) => {
                setData(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    //start of reservation
    const BookTableButton = styled(Button)({
        padding: "10px 110px",
        marginTop: "23px",
        backgroundColor: "#F49300",
        fontWeight: "bold",
        color: "black",
        borderRadius: "5px",
        ":hover": {
            backgroundColor: "black",
            color: "#F49300",
        },
    });

    const DeleteReservationButton = styled(Button)({
        padding: "10px 110px",
        marginTop: "23px",
        backgroundColor: "black",
        color: "#F49300",
        fontWeight: "bold",
        borderRadius: "5px",
        ":hover": {
            backgroundColor: "#F49300",
            color: "black",
        },
    });

    // =========================states=========================
    let ref = useRef(null);
    // for modal
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    // for the date
    const todayDate = dayjs();
    const [displayDate, setDisplayDate] = useState(todayDate);

    // for the time
    const [displayTime, setDisplayTime] = useState(0);
    const [endTime , setEndTime] = useState(0);
    const [startTime , setStartTime] = useState(0);

    // =========================functions=========================
    // event handlers
    const handleDateChange = (event) => {
        setDisplayDate(event);
        // triggerChanges();
    };

    const handleTimeChange = (timeDifference) => {
        // isIncreasing: true means increase time, false means decrease
        var newTime = displayTime + timeDifference;
        console.log(newTime);
        // check for boundaries
        // not outside boundary
        if (newTime <= endTime && newTime >= startTime) {
            // console.log(newTime);
            setDisplayTime(newTime);
            // triggerChanges();
        }
    };

    // helper functions
    // const triggerChanges = () => {
    //     var res =
    //         "Here is Li Qi and SangHil's magic: " +
    //         displayDate.$d +
    //         timeFormatConverter(displayTime);
    //     alert(res);
    // };

    // for the time
    const timeFormatConverter = (time) => {
        time = time.toString();
        let hours = "";
        let minutes = "";
        if (time.length == 4) {
            hours = time.substr(0, 2);
            minutes = time.substr(2);
        } else {
            hours = time.substr(0, 1);
            minutes = time.substr(1);
        }

        if (minutes === "50") {
            return hours + ":30";
        } else {
            return hours + ":00";
        }
    };

    const timeConverter = (time) => {
        time = time.toString();
        let hours = "";
        let minutes = "";
        if (time.length == 4) {
            hours = time.substr(0, 2);
            minutes = time.substr(2);
        } else {
            hours = "0" + time.substr(0, 1);
            minutes = time.substr(1);
        }
        if (minutes === "50") {
            return hours + "30";
        } else {
            return hours + "00";
        }
    };

    // for the date converter
    const convertDate = (date) => {
        return date.format("YYYY-MM-DD");
    };

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid
                    item
                    xs={6}
                    alignContent={"middle"}
                    sx={{
                        display: "flex",
                        justifyContent: "middle",
                    }}
                >
                    <Button
                        variant="filled"
                        sx={{
                            color: "black",
                            margin: "auto",
                            background: "orange",
                            transition: "background 0.5s, color 0.5s",
                            "&:hover": {
                                background: "#b17200",
                                color: "white",
                            },
                        }}
                        className={"interfaceButton"}
                        onClick={() => {
                            refreshPage();
                        }}
                    >
                        Refresh
                        <RefreshIcon
                            onClick={() => {
                                refreshPage();
                            }}
                        ></RefreshIcon>
                    </Button>
                </Grid>
                <Grid
                    item
                    xs={6}
                    sx={{
                        display: "flex",
                        justifyContent: "middle",
                    }}
                >
                    <Button
                        sx={{
                            margin: "auto",
                            background: "orange",
                            transition: "background 0.5s, color 0.5s",
                            "&:hover": {
                                background: "#b17200",
                                color: "white",
                            },
                        }}
                        className={"interfaceButton"}
                    >
                        <CSVLink
                            data={csvData}
                            className={"interfaceButton"}
                            style={{
                                display: "flex",
                                textDecoration: "none",
                            }}
                        >
                            Export to CSV
                            <DownloadIcon />
                        </CSVLink>
                    </Button>
                </Grid>
            </Grid>

            <div>
                <Grid container spacing={2}>
                    <Grid item md={8} lg={6} sx={{ margin: "auto" }}>
                        <ReservationTableLayout
                            time={timeConverter(displayTime)}
                            date={convertDate(displayDate)}
                        />
                    </Grid>

                    {/* Right side layout */}
                    <Grid
                        item
                        md={4}
                        lg={6}
                        className="admin-interface"
                        sx={{
                            width: {
                                xs: "80%",
                            },
                            margin: "0px auto",
                        }}
                    >
                        <Box
                            sx={{
                                margin: "10px auto",
                                width: {
                                    // xs: "80%",
                                    lg: "80%",
                                },
                            }}
                        >
                            {/* Date Selector */}
                            <div className="formSection">
                                <Typography variant="h5">Date</Typography>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        value={displayDate}
                                        onChange={handleDateChange}
                                        format="YYYY/MM/DD"
                                        textField={(params) => (
                                            <TextField {...params} />
                                        )}
                                        InputAdornmentProps={{
                                            position: "start",
                                        }}
                                        sx={{ width: "100%" }}
                                    />
                                </LocalizationProvider>
                            </div>

                            {/* Time Selector */}
                            <div
                                className="formSection"
                                style={{ width: "100%" }}
                            >
                                <Typography variant="h5">Time</Typography>
                                {/* Time selection with Manual Time picker that was drawn in Figma */}
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            handleTimeChange(-50);
                                        }}
                                        sx={{
                                            backgroundColor: "#F49300",
                                            color: "black",
                                            transition:
                                                "background 0.5s, color 0.5s",
                                            "&:hover": {
                                                background: "#b17200",
                                                color: "white",
                                            },
                                        }}
                                    >
                                        {"<"}
                                    </Button>
                                    <Typography variant={"h6"}>
                                        {timeFormatConverter(displayTime)}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            handleTimeChange(50);
                                        }}
                                        sx={{
                                            backgroundColor: "#F49300",
                                            color: "black",
                                            transition:
                                                "background 0.5s, color 0.5s",
                                            "&:hover": {
                                                background: "#b17200",
                                                color: "white",
                                            },
                                        }}
                                    >
                                        {">"}
                                    </Button>
                                </Box>
                            </div>

                            {/* Legend */}
                            <div className="centred formSection">
                                <Typography variant="h5">Legend</Typography>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    align="center"
                                                    component="th"
                                                >
                                                    <b>Symbol</b>
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    component="th"
                                                >
                                                    <b>Item</b>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="left">
                                                    {" "}
                                                    <img
                                                        src="https://i.postimg.cc/Jn0Qsv9Y/2paxtable.png"
                                                        style={floatImages}
                                                    ></img>
                                                </TableCell>
                                                <TableCell align="left">
                                                    2-Pax Table
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">
                                                    {" "}
                                                    <img
                                                        src="https://i.postimg.cc/63PfnzKW/4paxtable.png"
                                                        style={floatImages}
                                                    ></img>
                                                </TableCell>
                                                <TableCell align="left">
                                                    4-Pax Table
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">
                                                    {" "}
                                                    <img
                                                        src="https://i.postimg.cc/xqDGFCqB/availablecircle.png"
                                                        style={floatImages}
                                                    ></img>
                                                </TableCell>
                                                <TableCell align="left">
                                                    {" "}
                                                    Available
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">
                                                    {" "}
                                                    <img
                                                        src="https://i.postimg.cc/L5ZBTf4z/takencircle.png"
                                                        style={floatImages}
                                                    ></img>
                                                </TableCell>
                                                <TableCell align="left">
                                                    Taken
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <Grid container className="GridContainerCenter">
                                {" "}
                                <BookTableButton
                                    ref={ref}
                                    onClick={() => setShow(true)}
                                >
                                    Make a Reservation
                                </BookTableButton>
                                <Modal
                                    onClose={() => setShow(false)}
                                    show={show}
                                />
                            </Grid>
                            <Grid container className="GridContainerCenter">
                                {" "}
                                <DeleteReservationButton
                                    ref={ref}
                                    onClick={() => setShowDelete(true)}
                                >
                                    Delete Reservation
                                </DeleteReservationButton>
                                <Delete
                                    onClose={() => setShowDelete(false)}
                                    show={showDelete}
                                />
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </React.Fragment>
    );
}

export default AdminInterface;
