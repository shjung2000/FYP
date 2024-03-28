const express = require("express");

const { check } = require("express-validator");

const router = express.Router();

const ReservationController = require("../Controllers/ReservationController");

/*
router.post(
    "/timing",
    [check("date").not().isEmpty(), check("pax").not().isEmpty()],
    ReservationController.getAvailableTiming
);
*/

router.get("/", ReservationController.getReservations); // To get all reservations for the admin delete functionality

router.get("/:reservationId", [], ReservationController.getReservationById);
//router.post("/", [], ReservationController.createReservation);   //Siang Meng's createReservation route

router.post("/createReservation" , [] , ReservationController.createReservationNew);  //SangHil's new createReservation route

router.post("/getAvailableTiming" , [] , ReservationController.findAvailableTimingNew);   //SangHil's new getAvailableTiming route

router.post("/getTableCombination" , []  , ReservationController.getTableCombination);  //SangHil's getTableCombination route

//router.post("/confirm", [], ReservationController.testEmailConfirmation);

router.delete("/:reservationId", [], ReservationController.cancelReservation);

router.post("/getAllTimingList" , [] , ReservationController.getAllTImingList); 

module.exports = router;
