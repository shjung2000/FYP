const express = require("express");

const { check } = require("express-validator");

const router = express.Router();

const AttendanceController = require("../Controllers/AttendanceController");


router.post("/getEmployeeByDate" , [] , AttendanceController.getEmployeeByDate);

router.post("/addEmployee" , [] , AttendanceController.addEmployee);


router.delete("/deleteEmployee/:id" , [] , AttendanceController.deleteEmployee);


router.put("/updateEmployee/:id" , [] , AttendanceController.updateEmployee);

router.get("/retrieveTotalAmount/:year" , [] ,AttendanceController.retrieveTotalAmount);


module.exports = router;


