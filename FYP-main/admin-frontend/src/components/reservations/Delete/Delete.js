import React, { useEffect, useState } from "react";
import "./Delete.css";
import axios from "axios";
import { TextField, Grid } from "@mui/material";
import UsersList from "../../Users/UsersList/UsersList";

function Delete(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const sendRequest = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}reservation/getReservations`
                );

                const responseData = await response.json();

                setLoadedUsers(responseData.users);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
            }
            setIsLoading(false);
        };
    }, []);

    // const USERS = [{id: "u1", email: "xavier.ng.2020@scis.smu.edu.sg", name: "xavier", pax: 2, date_of_visit: "2023-03-04", time: "1900"}, {id: "u2", email: "Tommy.tan.2020@scis.smu.edu.sg", name: "Tommy", pax: 8, date_of_visit: "2023-03-04", time: "1900"}];

    const [data, setData] = useState([]);
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BACKEND_URL}reservation/`)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    if (!props.show) {
        return null;
    }
    return (
        <div className="modal" onClick={props.onClose}>
            <div
                className="delete-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h4 className="modal-title">Reservations</h4>
                </div>
                <div className="modal-body">
                    {/* The line below is Xavier's testing */}
                    {/* <UsersList items={USERS}/> */}
                    <UsersList items={data} />
                </div>
                {/* <div className='modal-footer'>
          <button onClick={props.onClose} className='button'>Close</button>
        </div> */}
            </div>
        </div>
    );
}

export default Delete;
