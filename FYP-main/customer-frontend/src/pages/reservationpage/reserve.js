import React, { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import "./reserve.css";
import ErrorModal from "../../components/reservation/ErrorModal";
import SuccessModal from "../../components/reservation/SuccessModal";

import {
    TextField,
    Stack,
    Grid,
    Button,
    Box,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    LinearProgress,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import InputAdornment from "@mui/material/InputAdornment";
import PhoneIcon from "@mui/icons-material/Phone";

import Typography from "@mui/material/Typography";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailIcon from "@mui/icons-material/Email";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { DialogTitle } from "@mui/material";




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

const ErrorMessage = styled(Typography)({
    color: "red",
    textAlign: "left",
    fontSize: 15,
    "& .MuiTypography-root": {
        margin: "0px",
    },
});

function Reserve() {
    const { pathname } = useLocation();
    let location = useLocation();
    useEffect(() => {
        if (location.hash) {
            let elem = document.getElementById(location.hash.slice(1));
            if (elem) {
                elem.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
    }, [location]);
    let [timingFetched, fetchTiming] = useState([]);

    const todayDate = new Date();

    let [open, setOpen] = useState(false);
    let [sendingReservation, setSendingReservation] = useState(false);
    let [buttonWidth, setButtonWidth] = useState(0);

    let ref = useRef(null);

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    let [name, setName] = useState("");

    let [phoneNumber, setPhoneNumber] = useState("");

    let [email, setEmail] = useState("");
    const handleEmailChange = (event) => {
        console.log(event.key);
    };

    let [numpax, setNumPax] = useState("");
    const handlePaxChange = (event) => {
        let newPax = event.target.value;
        setNumPax(newPax);
        numpax = newPax;
        getTiming();
    };
    
    let [reserveDate, setDate] = useState(todayDate);
    const handleDateChange = (event) => {
        console.log("event", event);
        setDate(event);
        reserveDate = event.$d;
        getTiming();
    };

    const [timeslot, setTimeslot] = useState("");
    const handleTimeslotChange = (event) => {
        setTimeslot(event.target.value);
    };

    // ==========this is to ensure that the loader width follows button width==========
    useEffect(() => {
        const handleWindowResize = () => {
            // setWindowWidth(window.innerWidth);
            setButtonWidth(ref.current.offsetWidth);
        };
        window.addEventListener("resize", handleWindowResize);
    });
    useEffect(() => {
        setButtonWidth(ref.current.offsetWidth);
    }, []);

    function TimeLogicHandling({ arrayStatus }) {
        if (arrayStatus.length > 0) {
            return (
                <FormControl
                    sx={{ m: 1, minWidth: 300 }}
                    id="timeInput"
                    style={{ borderColor: "black" }}
                >
                    <InputLabel>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <AccessTimeIcon id="shiftIcon" />
                            <Typography className="roboto">Time</Typography>
                        </Stack>
                    </InputLabel>
                    <Select
                        value={timeslot}
                        label="xxx Time"
                        onChange={handleTimeslotChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        id="selectTime"
                    >
                        {timingFetched.map((timing) => {
                            const { value, label } = timing;
                            return <MenuItem value={value}>{label}</MenuItem>;
                        })}
                        ;
                    </Select>
                </FormControl>
            );
        } else if (arrayStatus.length === 0) {
            return (
                <FormControl
                    sx={{ m: 1, minWidth: 300 }}
                    id="timeInput"
                    disabled
                >
                    <InputLabel>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <AccessTimeIcon id="shiftIcon" />
                            <Typography className="roboto">
                                None Available
                            </Typography>
                        </Stack>
                    </InputLabel>
                    <Select
                        value={timeslot}
                        label="pax"
                        onChange={handleTimeslotChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        id="selectTime"
                    >
                        {timingFetched.map((timing) => (
                            <MenuItem value={timing}>{timing}</MenuItem>
                        ))}
                        ;
                    </Select>
                </FormControl>
            );
        }
    }

    const [openErrorModal, setErrorModal] = React.useState(false);

    const getTiming = async (event) => {
        
        let timing_list = [];

        await fetch(
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
                timing_list = response;
            })
            .catch((error) => {
                console.error("Error", error);
            });

        console.log(timing_list);
        
        let dateObject = new Date(reserveDate.toJSON().split("T")[0]);
        let year = dateObject.getFullYear();
        let month = dateObject.getMonth() + 1;
        let day = dateObject.getDate();

        let dayOfToday = todayDate.getDate();

        if (day < dayOfToday) {
            day += 1;
        }

        if (month < 10) {
            month = "0" + month;
        }

        if (day < 10) {
            day = "0" + day;
        }

        let date = `${year}-${month}-${day}`;

        let pax = +numpax;

        console.log(date);
        console.log(pax);

        await fetch(
            `${process.env.REACT_APP_BACKEND_URL}reservation/getAvailableTiming`,
            {
                crossDomain: true,
                method: "POST",
                body: JSON.stringify({
                    date: date,
                    pax: pax,
                }),
                headers: { "Content-Type": "application/json" },
            }
        )
            .then((res) => res.json())
            .then((response) => {
                let return_list = [];
                response.map(function (timing) {
                    let index = timing_list.indexOf(timing);
                    timing_list.splice(index, 1);
                });
                timing_list.map(function (timing) {
                    let newTiming = changeTimeFormat(timing);
                    // the value should still be in in HHmm (this is for the datetime part for adding reservation)
                    // the formatted timing can be used as a label
                    return_list.push({ value: timing, label: newTiming });
                });
                fetchTiming(return_list);
                console.log(return_list);
            })
            .catch((error) => {
                console.error("Error", error);
            });
    };

    const changeTimeFormat = (time) => {
        let hour = time.slice(0, 2);
        let minute = time.slice(2);
        let newString;
        
        if(hour[0] === "0"){
            newString = hour[1] + ":" + minute + "AM";
        }else if(hour === "10" || hour === "11"){
            newString = hour + ":" + minute + "AM";
        }else if (hour === "13") {
            hour = "1:";
            newString = hour + minute + "PM";
        } else if (hour === "14") {
            hour = "2:";
            newString = hour + minute + "PM";
        } else if (hour === "15") {
            hour = "3:";
            newString = hour + minute + "PM";
        } else if (hour === "16") {
            hour = "4:";
            newString = hour + minute + "PM";
        } else if (hour === "17") {
            hour = "5:";
            newString = hour + minute + "PM";
        } else if (hour === "18") {
            hour = "6:";
            newString = hour + minute + "PM";
        } else if (hour === "19") {
            hour = "7:";
            newString = hour + minute + "PM";
        } else if (hour === "20") {
            hour = "8:";
            newString = hour + minute + "PM";
        } else if (hour === "21") {
            hour = "9:";
            newString = hour + minute + "PM";
        } else if (hour === "22") {
            hour = "10:";
            newString = hour + minute + "PM";
        } else if(hour === "23") {
            hour = "11:";
            newString = hour + minute + "PM";
        } else{
            hour = "12:";
            newString = hour + minute + "PM";
        }

        return newString;
    };

    const [openSuccessModal, setSuccessModal] = React.useState(false);
    // errors
    const [nameError, setNameError] = React.useState();
    const [emailError, setEmailError] = React.useState();
    const [numPaxError, setNumPaxError] = React.useState();
    const [phoneNumberError, setPhoneNumberError] = React.useState();
    const [timeslotError, setTimeslotError] = React.useState();

    //End of Siang Meng's bookTable function

    //Start of SangHil's bookTable function
    const bookTableNew = async () => {
        let dateObject = new Date(reserveDate.toJSON().split("T")[0]);
        let year = dateObject.getFullYear();
        let month = dateObject.getMonth() + 1;
        let day = dateObject.getDate();

        let dayOfToday = todayDate.getDate();

        if (day < dayOfToday) {
            day += 1;
        }

        if (month < 10) {
            month = "0" + month;
        }

        if (day < 10) {
            day = "0" + day;
        }

        let date = `${year}-${month}-${day}`;

        let pax = +numpax;

        let timeSlotString = timeslot.toString();
        let hour = timeSlotString.substring(0, 2);
        let minutes = timeSlotString.substring(2, 4);
        let time_send = hour + minutes;

        let phoneNumberTrimmed = phoneNumber.replaceAll(" ", "");
        let phone = `+65 ${phoneNumberTrimmed}`;

        // validation
        const EMAIL_REGEX =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const SINGAPORE_PHONE_NUMBER_REGEX = /^[(6|8|9)\d{7}]{8}$/;

        let errorCount = 0;

        if (name.length == 0) {
            errorCount += 1;
            setNameError("*Please enter your name");
        } else {
            setNameError("");
        }
        if (numpax === null || numpax.length == 0) {
            setNumPaxError("*Please select the number of people");
            errorCount += 1;
        } else {
            setNumPaxError("");
        }
        if (timeSlotString.length == 0 || timeSlotString === null) {
            setTimeslotError("*Please select a timeslot");
            errorCount += 1;
        } else {
            setTimeslotError("");
        }
        if (EMAIL_REGEX.test(email) === false || email.length == 0) {
            setEmailError("*Please enter a valid email");
            errorCount += 1;
        } else {
            setEmailError("");
        }
        if (SINGAPORE_PHONE_NUMBER_REGEX.test(phoneNumber) === false || phoneNumber.length == 0) {
            setPhoneNumberError("*Please enter a valid phone number");
            errorCount += 1;
        } else {
            setPhoneNumberError("");
        }
        console.log(errorCount);
        if (errorCount > 0) {
            return;
        }

        await fetch(
            `${process.env.REACT_APP_BACKEND_URL}reservation/createReservation`,
            {
                crossDomain: true,
                method: "POST",
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    pax,
                    date_of_visit: date,
                    time: time_send,
                }),
                headers: { "Content-Type": "application/json" },
            }
        )
            .then((res) => res.json())
            .then((response) => {
                console.log(
                    response.message === "Reservation created successfully"
                );
                if (response.message === "Reservation created successfully") {
                    setSuccessModal(true);
                } else {
                    setErrorModal(true);
                }

                setSendingReservation(false);
            })
            .catch((error) => {
                console.error("Error", error);
                setErrorModal(true);
                setSendingReservation(false);
            });
    };

    //End of SangHil's bookTable function

    return (
        <React.Fragment>
            <div className="firstBlock" style={{}}>
                {/*Start of First Block*/}
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    id="first_block"
                    style={{ backgroundImage: `url("")` }}
                >
                    <Grid container spacing={0} className="gridContainer">
                        <Grid container className="reservationText">
                            <Box textAlign={"center"}>
                                <h6 className="roboto" id="reservationWord">
                                    R E S E R V A T I O N
                                </h6>
                                <h1
                                    className="seoul"
                                    id="bookTableWord"
                                    style={{
                                        color: "#F49300",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Book A Table
                                </h1>
                                <p className="roboto" id="changeOne">
                                    Honey Night is open everyday besides Tuesday
                                </p>
                                <p className="roboto" id="changeThree">
                                    Operating Hours: 12pm to 11pm
                                </p>
                                <p className="roboto" id="changeTwo">
                                    Make a reservation online or send a booking
                                    request on{" "}
                                    <u
                                        onClick={handleOpenDialog}
                                        style={{
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                            textUnderlineOffset: "4px",
                                        }}
                                    >
                                        Whatsapp
                                    </u>
                                </p>
                                <Dialog
                                    open={open}
                                    onClose={handleCloseDialog}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle>
                                        Scan or Whatsapp to +65 86711443
                                    </DialogTitle>
                                    <DialogContent>
                                        <img
                                            style={{
                                                width: "350px",
                                                height: "350px",
                                            }}
                                            alt=""
                                            src="https://res.cloudinary.com/duxqahhdk/image/upload/v1677220899/fyp/reservation/honeynightqrcode_rwzii6.jpg"
                                            // src = "https://lh3.googleusercontent.com/p/AF1QipPmQu_-uCy1LJeNnJNJHlkA9JwG1xebj19pVUH6=s1280-p-no-v1"
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseDialog}>
                                            Close
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Box>
                        </Grid>
                    </Grid>
                    {/*End of First Block*/}
                    {/*Start of Pax Input Field Block*/}
                    <Grid container className="GridContainerCenter">
                        <FormControl sx={{ m: 1, minWidth: 300 }}>
                            <InputLabel>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={1}
                                >
                                    <AccountCircleIcon id="shiftIcon" />
                                    <Typography className="roboto">
                                        Number of Pax
                                    </Typography>
                                </Stack>
                            </InputLabel>
                            <Select
                                value={numpax}
                                label="xxx Number of Pax"
                                onChange={handlePaxChange}
                                displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                            >
                                <MenuItem value={1}>1 Pax</MenuItem>
                                <MenuItem value={2}>2 Pax</MenuItem>
                                <MenuItem value={3}>3 Pax</MenuItem>
                                <MenuItem value={4}>4 Pax</MenuItem>
                                <MenuItem value={5}>5 Pax</MenuItem>
                                <MenuItem value={6}>6 Pax</MenuItem>
                                <MenuItem value={7}>7 Pax</MenuItem>
                                <MenuItem value={8}>8 Pax</MenuItem>
                                <MenuItem value={9}>9 Pax</MenuItem>
                                <MenuItem value={10}>10 Pax</MenuItem>
                            </Select>
                            <ErrorMessage>{numPaxError}</ErrorMessage>
                        </FormControl>
                    </Grid>
                    {/*End of Time Input Field Block*/}
                    {/*Start of Date Input Field Block*/}
                    <Grid container className="GridContainerCenter">
                        <FormControl
                            sx={{ m: 1, minWidth: 300 }}
                            id="dateInput"
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    value={reserveDate}
                                    onChange={handleDateChange}
                                    inputFormat="YYYY/MM/DD"
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                    InputAdornmentProps={{ position: "start" }}
                                    minDate={todayDate}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                    {/*End of Date Input Field Block*/}
                    {/*Start of Time Input Field Block*/}
                    <Grid container className="GridContainerCenter">
                        <Box>
                            <TimeLogicHandling arrayStatus={timingFetched} />
                            <ErrorMessage sx={{ ml: 1, mt: 0 }}>
                                {timeslotError}
                            </ErrorMessage>
                        </Box>
                    </Grid>
                    {/*End of Time Input Field Block*/}

                    {/*Start of Name Input Field Block*/}
                    <Grid container className="GridContainerCenter">
                        <Box
                            component="form"
                            sx={{
                                "& > :not(style)": { minWidth: 300 },
                                marginTop: "23px",
                            }}
                            noValidate
                            autoComplete="off"
                            id="nameInput"
                        >
                            <TextField
                                id="input-with-icon-textfield"
                                placeholder="Name"
                                value={name}
                                // onKeyDown={handleEmailChange}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon id="shiftIcon" />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                            />
                            <ErrorMessage sx={{ "& > :not(style)": { mt: 0 } }}>
                                {nameError}
                            </ErrorMessage>
                        </Box>
                    </Grid>
                    {/*End of Name Input Field Block*/}

                    {/*Start of Phone Number Input Field Block*/}
                    <Grid container className="GridContainerCenter">
                        <Box
                            component="form"
                            sx={{
                                "& > :not(style)": { minWidth: 300 },
                                marginTop: "23px",
                            }}
                            noValidate
                            autoComplete="off"
                            id="nameInput"
                        >
                            <TextField
                                id="input-with-icon-textfield"
                                placeholder="Phone Number (+65)"
                                value={phoneNumber}
                                // onKeyDown={handleEmailChange}
                                onChange={(e) => {
                                    setPhoneNumber(e.target.value);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon id="shiftIcon" />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                            />
                            <ErrorMessage sx={{ "& > :not(style)": { mt: 0 } }}>
                                {phoneNumberError}
                            </ErrorMessage>
                        </Box>
                    </Grid>
                    {/*End of Phone Number Input Field Block*/}

                    {/*Start of Email Input Field Block*/}
                    <Grid container className="GridContainerCenter">
                        <Box
                            component="form"
                            sx={{
                                "& > :not(style)": { minWidth: 300 },
                                marginTop: "23px",
                            }}
                            noValidate
                            autoComplete="off"
                            id="emailInput"
                        >
                            <TextField
                                id="input-with-icon-textfield"
                                placeholder="Email"
                                value={email}
                                // onKeyDown={handleEmailChange}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon id="shiftIcon" />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                            />
                            <ErrorMessage sx={{ "& > :not(style)": { mt: 0 } }}>
                                {emailError}
                            </ErrorMessage>
                        </Box>
                    </Grid>
                    {/*End of Email Input Field Block*/}

                    {/*Start of Book Button Block*/}
                    <Grid container className="GridContainerCenter">
                        {" "}
                        <BookTableButton
                            ref={ref}
                            onClick={() => {
                                bookTableNew();
                            }}
                        >
                            Book Now
                        </BookTableButton>
                    </Grid>
                    <Box
                        sx={{
                            width: `${buttonWidth}px`,
                            margin: "10px auto",
                        }}
                    >
                        {sendingReservation ? (
                            <>
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
                                Making reservation ...
                            </>
                        ) : (
                            <> </>
                        )}
                    </Box>
                    {/*End of Book Button Block*/}
                    <ErrorModal
                        openErrorModal={openErrorModal}
                        setOpenModal={setErrorModal}
                    />
                    <SuccessModal
                        openSuccessModal={openSuccessModal}
                        setOpenModal={setSuccessModal}
                    />
                </Grid>
            </div>
            {/*End of Third Block */}
        </React.Fragment>
    );
}

export default Reserve;
