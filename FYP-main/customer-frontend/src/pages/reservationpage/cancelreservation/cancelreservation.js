import React from "react";
import IndivdualReservation from "../../../components/reservation/IndivdualReservation";
import { useParams } from "react-router-dom";

function CancelReservation() {
    const { reservationId } = useParams();

    return (
        <>
            <IndivdualReservation
                reservationId={reservationId}
                readOnly={false}
            />
        </>
    );
}

export default CancelReservation;
