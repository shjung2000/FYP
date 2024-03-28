// import React from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import DeleteSuccessModal from "../../reservations/Modal/DeleteSuccessModal";
import DeleteErrorModal from "../../reservations/Modal/DeleteErrorModal";
import "./UserItem.css";

// const [loadSuccess, setLoadSuccess] = useState(false);
// // delete success --> to delete reservation
// const [deleteSuccess, setDeleteSuccess] = useState(false);

// const [triggeredDelete, setTriggeredDelete] = useState(false);
// const [reservation, setReservation] = useState(null);

// const cancelReservation = async () => {
//     await axios
//         .delete(
//             `${process.env.REACT_APP_BACKEND_URL}reservation/${reservationId}`
//         )
//         .then(() => {
//             setTriggeredDelete(true);
//             setDeleteSuccess(true);
//         })
//         .catch(() => {
//             setTriggeredDelete(false);
//             setDeleteSuccess(false);
//             alert("Failed to delete. Please try again later.");
//         });
// };

// function deleteData(id) {
//     axios.delete(`${process.env.REACT_APP_BACKEND_URL}reservation/${id}`)
//       .then(res => {
//           console.log("This button actually calls the deleteData function")
//         // setData(data.filter(data => data._id !== id));
//         // ^ Remove the deleted data from the local state
//           console.log(res)
//         //   window.location.reload()

//       })
//       .catch(err => {
//         console.log(err);
//       });
// }

async function deleteData2(id) {
    console.log("this function is called");
    // try {
    //     const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}reservation/${id}`)
    //     console.log(res)
    //     console.log("THis button calls the async function")

    // } catch (error) {
    //     alert(error)
    // }
    console.log(`${process.env.REACT_APP_BACKEND_URL}reservation/${id}`);
    await axios
        .delete(`${process.env.REACT_APP_BACKEND_URL}reservation/${id}`)

        .then((result) => {
            console.log(result);
            console.log(".then");
        })
        .catch((err) => {
            console.log(err);
            // window.location.reload()
        });
}

// const removeUser = async (id) => {
//     try {
//         const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}reservation/${id}`)
//         console.log(res)

//     } catch (error) {
//         alert(error)
//     }
// }

const UserItem = ({
    status,
    id,
    name,
    date_of_visit,
    time,
    email,
    pax,
    phone,
}) => {
    // delete success --> to delete reservation
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [triggeredDelete, setTriggeredDelete] = useState(false);
    const [reservation, setReservation] = useState(null);
    // delete reservation (trigggerd by confirmation)
    const [openSuccessModal, setSuccessModal] = useState(false);
    const [openErrorModal, setErrorModal] = useState(false);

    const formatTime = (time) => {
        time = time.toString();
        var hours = time.substr(0, 2);
        var mins = time.substr(2);
        return hours + ":" + mins;
    };

    const cancelReservation = async () => {
        console.log("cancelReservation function is called");
        await axios
            .delete(`${process.env.REACT_APP_BACKEND_URL}reservation/${id}`)
            .then((response) => {
                setTriggeredDelete(true);
                setDeleteSuccess(true);
                if (response["data"]["message"] === "Deleted Successfully") {
                    setSuccessModal(true);
                } else {
                    setErrorModal(true);
                }
                setTimeout(window.location.reload.bind(window.location), 1000);
            })
            .catch(() => {
                setTriggeredDelete(false);
                setDeleteSuccess(false);
                alert("Failed to delete. Please try again later.");
            });
    };

    // const userid = props._id.toString()

    return (
        <>
            <DeleteErrorModal
                openErrorModal={openErrorModal}
                setOpenModal={setErrorModal}
            />
            <DeleteSuccessModal
                openSuccessModal={openSuccessModal}
                setOpenModal={setSuccessModal}
            />
            {status === 1 ? (
                <TableRow className="user-item">
                    {/* <div className="user-item__content"> */}
                    <TableCell align="center" className="deleteTableCell">{id}</TableCell>
                    <TableCell align="center" className="deleteTableCell">{name}</TableCell>
                    <TableCell align="center" className="deleteTableCell">{date_of_visit}</TableCell>
                    <TableCell align="center" className="deleteTableCell">{formatTime(time)}</TableCell>
                    <TableCell align="center" className="deleteTableCell">{pax}</TableCell>
                    <TableCell align="center" className="deleteTableCell">{phone}</TableCell>
                    <TableCell align="center" className="deleteTableCell">{email}</TableCell>
                    <TableCell align="center" className="deleteTableCell">
                        <Button
                            className={"deleteBtn"}
                            onClick={() => {
                                cancelReservation(id);
                            }}
                        >
                            <DeleteIcon
                                onClick={() => {
                                    cancelReservation(id);
                                }}
                            ></DeleteIcon>
                        </Button>
                    </TableCell>
                    {/* </div> */}
                </TableRow>
            ) : (
                <></>
            )}
        </>
    );

};

export default UserItem;
