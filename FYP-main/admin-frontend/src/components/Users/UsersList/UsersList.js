import React, { useState } from "react";

import UserItem from "../UserItem/UserItem";
import "./UsersList.css";
import {
    TextField,
    Grid,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
} from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const UsersList = (props) => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [order, setOrder] = useState(0);

    if (props.items.length === 0) {
        return (
            <div className="center">
                <h2>No users reservations found</h2>
            </div>
        );
    }
    // const list = [
    //     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    //     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    //     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    // ];

    return (
        <>
            <Grid container>
                <Grid item xs={6} sx={{ padding: "5px" }}>
                    {" "}
                    <TextField
                        sx={{ width: "100%" }}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        label="Search Name/Email/Phone no"
                    />
                </Grid>
                <Grid item xs={3} sx={{ padding: "5px" }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Sort By
                        </InputLabel>
                        <Select
                            value={category}
                            label="Sort By"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value={""}>Select Category</MenuItem>
                            <MenuItem value={"name"}>Name</MenuItem>
                            <MenuItem value={"email"}>Email</MenuItem>
                            <MenuItem value={"pax"}>Pax</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3} sx={{ padding: "5px" }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Order
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={order}
                            label="Order"
                            onChange={(e) => setOrder(e.target.value)}
                        >
                            <MenuItem value={0}>Order</MenuItem>
                            <MenuItem value={1}>Ascending</MenuItem>
                            <MenuItem value={2}>Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table
                    sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="a dense table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                <b>Reservation ID</b>
                            </TableCell>
                            <TableCell align="center">
                                <b>Customer Name</b>
                            </TableCell>
                            <TableCell align="center">
                                <b>Reservation Date</b>
                            </TableCell>
                            <TableCell align="center">
                                <b>Reservation Time</b>
                            </TableCell>
                            <TableCell align="center">
                                <b>Pax</b>
                            </TableCell>
                            <TableCell align="center">
                                <b>Phone</b>
                            </TableCell>
                            <TableCell align="center">
                                <b>Email</b>
                            </TableCell>
                            <TableCell align="center">
                                <b>Action</b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.items
                            .sort((a, b) =>
                                order == 1
                                    ? a[category] > b[category]
                                        ? 1
                                        : -1
                                    : order == 2
                                    ? a[category] < b[category]
                                        ? 1
                                        : -1
                                    : -1
                            )
                            .filter((item) => {
                                console.log(item);
                                const { name, email, phone } = item;
                                return (
                                    name
                                        .toLowerCase()
                                        .includes(search.toLowerCase()) ||
                                    email
                                        .toLowerCase()
                                        .includes(search.toLowerCase()) ||
                                    phone
                                        .toLowerCase()
                                        .includes(search.toLowerCase())
                                );
                            })
                            .map((user) => {
                                const {
                                    _id,
                                    name,
                                    email,
                                    pax,
                                    status,
                                    date_of_visit,
                                    time,
                                    phone,
                                } = user;
                                return (
                                    <UserItem
                                        key={_id}
                                        id={_id}
                                        name={name}
                                        email={email}
                                        pax={pax}
                                        status={status}
                                        date_of_visit={date_of_visit}
                                        time={time}
                                        phone={phone}
                                    />
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};
{
    /* {list.map((item) => {
                return <UserItem status={item} />;
            })} */
}

export default UsersList;
