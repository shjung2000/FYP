const HttpError = require("../Models/http-error");
const User = require("../Models/UserModel");

const getUserById = async (req, res, next) => {
    const { userId } = req.params;
    try {
        result = await User.findById(userId);
        if (!result) {
            return res.status(404).json({ message: "not found" });
        }
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
}

const getAllReservation = async(req , res , next) =>{
    let return_array = [];
    try{
        var reservations = await User.find({}).exec();
    }catch(error){
        const err = new HttpError(
            "Something went wrong while fetching data",
            500
        );
        return next(err);
    }

    if(reservations.length === 0){
        return res.json(return_array);
    }else{
        reservations.map(function(reservation){
            return_array.push(reservation);
        });
        return res.json(return_array);
    }

}

module.exports = {getUserById , getAllReservation}