import React, { useState, useEffect } from "react";
import {
    Typography,
    TableCell,
    TableRow,
    Select,
    MenuItem,
    FormControl,
    TextField,
    InputLabel,
    Table,
    TableHead,
    TableBody,
    TableContainer,
    Paper,
    Box,
    Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import dayjs from "dayjs";
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const ErrorMessage = styled(Typography)({
    color: "red",
    textAlign: "left",
    fontSize: 15,
    "& .MuiTypography-root": {
        margin: "0px",
    },
});

function Cost() {
    const today = dayjs();
    let [year, setYear] = useState(today.$y);
    const [password, setPassword] = useState("");
    const [haveError, setHaveError] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    let [annualData, setAnnualData] = useState([]);
    const getSalaries = async () => {
        await fetch(
            `${process.env.REACT_APP_BACKEND_URL}employee/retrieveTotalAmount/${year}`,
            {
                crossDomain: true,
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        )
            .then((res) => res.json())
            .then((processedRes) => {
                setAnnualData(processedRes);
                // console.log(processedRes);
            });
    };

    const loginAdmin = async () => {
        if (password !== process.env.REACT_APP_ADMIN_PASSWORD) {
            setHaveError(true);
        } else {
            setPassword("");
            setHaveError(false);
            setLoggedIn(true);
        }
    };

    useEffect(() => {
        getSalaries();
    }, [year]);
    return (
        <div>
            <>
                {!loggedIn ? (
                    <>
                        <Box
                            component={Paper}
                            sx={{
                                width: { xs: "90%", md: "60%", xl: "40%" },
                                margin: "10px auto",
                                padding: "20px",
                            }}
                        >
                            <Typography variant={"h4"} textAlign={"center"}>
                                Admin Login
                            </Typography>
                            <br />
                            <InputLabel>Enter Password</InputLabel>
                            <TextField
                                sx={{ width: "100%" }}
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            {haveError ? (
                                <>
                                    <ErrorMessage>
                                        Incorrect password
                                    </ErrorMessage>
                                </>
                            ) : (
                                <></>
                            )}

                            <br />
                            <Button
                                sx={{
                                    marginTop: "10px",
                                    width: "100%",
                                    backgroundColor: "#F49300",
                                    color: "black",
                                    transition: "background 0.5s, color 0.5s",
                                    "&:hover": {
                                        background: "#b17200",
                                        color: "white",
                                    },
                                }}
                                onClick={() => {
                                    loginAdmin();
                                }}
                            >
                                Login
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        {" "}
                        <Typography variant={"h4"}>
                            Monthly Cost Breakdown for {year}
                        </Typography>
                        <FormControl
                            sx={{ minWidth: 140, margin: "10px" }}
                            size="small"
                        >
                            <InputLabel id="demo-simple-select-label">
                                Select Year
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={year}
                                label="Select Year"
                                onChange={(e) => {
                                    setYear(e.target.value);
                                }}
                            >
                                <MenuItem value={2023}>2023</MenuItem>
                                <MenuItem value={2024}>2024</MenuItem>
                                <MenuItem value={2025}>2025</MenuItem>
                            </Select>
                        </FormControl>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    {months.map((month, index) => {
                                        return (
                                            <TableCell
                                                align="left"
                                                component="th"
                                                key={index}
                                                sx={{
                                                    width: {
                                                        xs: "120px",
                                                        lg: "150px",
                                                    },
                                                }}
                                            >
                                                <b>{month.substring(0, 3)}</b>
                                            </TableCell>
                                        );
                                    })}
                                </TableHead>
                                <TableBody>
                                    {months.map((month, index) => {
                                        return (
                                            <TableCell
                                                align="left"
                                                key={index}
                                                sx={{
                                                    width: {
                                                        xs: "120px",
                                                        lg: "150px",
                                                    },
                                                }}
                                            >
                                                $
                                                {(
                                                    Math.round(
                                                        annualData[month] * 100
                                                    ) / 100
                                                ).toFixed(2)}
                                            </TableCell>
                                        );
                                    })}
                                    <TableRow>
                                        <TableCell
                                            align="left"
                                            colSpan={12}
                                            component={"th"}
                                        >
                                            <b>Sub total</b>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" colSpan={12}>
                                            $
                                            {(
                                                Math.round(
                                                    annualData["Total"] * 100
                                                ) / 100
                                            ).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </>
        </div>
    );
}

export default Cost;
