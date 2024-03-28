const express = require("express");

const router = express.Router();

const UserController = require("../Controllers/UserController");

const HttpError = require("../Models/http-error");

const DUMMY_USERS = [{
    id: 'u1',
    name: 'xavier'
}];

router.get("/:uid", (req, res, next) => {
    const userId = req.params.uid;
    const user = DUMMY_USERS.find(u => {
        return u.id === userId;
    })

    if (!user) {
        throw new HttpError('COuld not find a user for the provided id.', 404);
    }
    res.json({user})
});

router.post("/getAllReservation" , [] , UserController.getAllReservation);

// router.get("/:userId", (req, res, next) => {
//     const userId = req.params.userId;
    
// })

// router.post("/");

// router.delete();

module.exports = router;