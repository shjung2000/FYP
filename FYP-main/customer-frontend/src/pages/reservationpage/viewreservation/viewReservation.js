import React from "react";
import IndivdualReservation from "../../../components/reservation/IndivdualReservation";
import { useParams } from "react-router-dom";

function ViewReservation() {
    const { reservationId } = useParams();

    return (
        <>
            <IndivdualReservation
                reservationId={reservationId}
            />
        </>
    );
}

export default ViewReservation;
