const {
    two_pax_table,
    four_pax_table,
} = require("../Constants/TwoFourPaxTables");

const {
    starting_hour,
    ending_hour
} = require("../Constants/OperatingTime");

const { combine_rule } = require("../Constants/CombineRule");

const Reservation = require("../Models/ReservationModel");

const User = require("../Models/UserModel");

const HttpError = require("../Models/http-error");

const { sendConfirmation } = require("../HelperFunctions/EmailFunctions");


require("dotenv").config();
const adminInterfaceLink = process.env.ADMIN_INTERFACE;

const HandleUserData = async(
    email,
    name,
    phoneNumber,
    date,
    time,
    user_table_id,
    status,
    pax,
    res
) => {
    let user = new User({
        email: email,
        name: name,
        phone: phoneNumber,
        pax: pax,
        date_of_visit: date,
        time: time,
        tableID: user_table_id,
        status: status,
    });
    try {
        user.save();
        await sendConfirmation(
            user,
            adminInterfaceLink + "/reservation/view/" + user._id,
            adminInterfaceLink + "/reservation/cancel/" + user._id
        );
        console.log(
            "User with name: " +
                name +
                " and email: " +
                email +
                " is successfully added into User Database"
        );
        return res.json({message:"Reservation created successfully"});
    } catch (error) {
        console.log("Error", error);
        const err = new HttpError(
            "Error during insertion of data into User Database",
            500
        );
        return next(err);
    }
};

const time_converter_another = (time, minutes) => {
    let return_array = [];
    let time_add_thirty_mins;
    let time_minus_thirty_mins;
    let time_integer = parseInt(time);


    //We need to first validate if the time selected is either "1200" or "2230" because they are extreme cases
    if (time === starting_hour) {
        //We just need to consider "1200" and "1230"
        if(time[0] === "0" && time.substring(2) === "00"){   //0800
            time_add_thirty_mins = "0" + (time_integer + 30).toString();   //0830
        }else if(time[0] === "0" && time.substring(2) === "30"){   
            if(time_integer + 30 === 1000){     //time is 0930 -> 1000
                time_add_thirty_mins = "1000";
            }else{
                time_add_thirty_mins = "0" + (time_integer + 70).toString();   //if time is 0830 -> 0900 | if time is 0730 -> 0800
            }
        }else{
            time_add_thirty_mins = (time_integer + 30).toString(); //1230
        }
        time_minus_thirty_mins = "";
    } else if (time === ending_hour) {
        //We just need to consider "2230" and "2200"
        if(time.substring(2) === "30"){
            //time is like 2230
            time_add_thirty_mins = "";
            time_minus_thirty_mins = (time_integer - 30).toString(); //2200
        }else if(time.substring(2) === "00"){
            time_add_thirty_mins = "";
            time_minus_thirty_mins = (time_integer - 70).toString(); //2130
        }
    } else {
        //We need to consider both +-30 minutes of the selected time
        if (minutes === "30") {
            if(time[0] === "0" && time[1] !== "9"){
                //0830
                time_add_thirty_mins = "0" + (time_integer + 70).toString();
                time_minus_thirty_mins = "0" + (time_integer - 30).toString();
            }else if(time[0] === "0" && time[1] === "9"){
                time_add_thirty_mins = "1000";
                time_minus_thirty_mins = "0900";
            }
            else{
                //If code reaches here, the time we receive is something like "1330"
                time_add_thirty_mins = (time_integer + 70).toString(); //This is selected timing + 30 minutes -> 1400
                time_minus_thirty_mins = (time_integer - 30).toString(); //This is selected timing - 30 minutes -> 1300
            }
        } else {
            if(time[0] === "0"){
                //0900
                time_add_thirty_mins = "0" + (time_integer + 30).toString();
                time_minus_thirty_mins = "0" + (time_integer - 70).toString();
            }else if(time === "1000"){
                time_add_thirty_mins = "1030";
                time_minus_thirty_mins = "0930";
            }else{
                //If code reaches here, the time we receive is something like "1300"
                time_add_thirty_mins = (time_integer + 30).toString(); //This is selected timing + 30 minutes   -> 1330
                time_minus_thirty_mins = (time_integer - 70).toString(); //This is selected timing - 30 minutes  -> 1230
            }
        }
    }

    return_array.push(time_add_thirty_mins);
    return_array.push(time_minus_thirty_mins);

    return return_array;
};

//This function deals with handling the data with Reservation database when there is no reservations made on the selected date
const HandleNoReservationPresent = (
    date,
    time,
    thirty_min_block_after,
    thirty_min_block_before,
    table_ID
) => {
    if (time === starting_hour) {
        //thirty_min_block_after is going to be "1230" and thirty_min_block_before is "" so we don't have to care about the latter
        let selected_timing_reservation = new Reservation({
            date_of_visit: date,
            time: time,
            tableID: table_ID,
        });
        let thirty_min_block_after_reservation = new Reservation({
            date_of_visit: date,
            time: thirty_min_block_after,
            tableID: table_ID,
        });
        //Add them into Reservation Database
        Reservation.insertMany([
            selected_timing_reservation,
            thirty_min_block_after_reservation,
        ])
            .then(function () {
                console.log(
                    "Data successfully inserted into Reservation Database for 1200 and 1230 timings"
                );
            })
            .catch(function (error) {
                console.log(
                    "Error during insertion of data into Reservation Database for 1200 and 1230 timings"
                );
            });
    } else if (time === ending_hour) {
        //thirty_min_block_after is going to be "" and thirty_min_block_before is going to be "2200" so we don't have to care about the former
        let selected_timing_reservation = new Reservation({
            date_of_visit: date,
            time: time,
            tableID: table_ID,
        });
        let template_array = [];
        let new_array = [];
        table_ID.map(function (id_array) {
            id_array.map(function(id){
                template_array.push(id.toString());  
            });
        });
        new_array.push(template_array);
        let thirty_min_block_before_reservation = new Reservation({
            date_of_visit: date,
            time: thirty_min_block_before,
            tableID: new_array,
        });
        //Add them into Reservation Database
        Reservation.insertMany([
            selected_timing_reservation,
            thirty_min_block_before_reservation,
        ])
            .then(function () {
                console.log(
                    "Data successfully inserted into Reservation Database for 2200 and 2230 timings"
                );
            })
            .catch(function (error) {
                console.log(
                    "Error during insertion of data into Reservation Database for 2200 and 2230 timings"
                );
            });
    } else {
        //These are the rest of the timings where we need to update both +-30 min blocks
        let selected_timing_reservation = new Reservation({
            date_of_visit: date,
            time: time,
            tableID: table_ID,
        });
        let thirty_min_block_after_reservation = new Reservation({
            date_of_visit: date,
            time: thirty_min_block_after,
            tableID: table_ID,
        });
        let template_array = [];
        let new_array = [];
        table_ID.map(function (id_array) {
            id_array.map(function(id){
                template_array.push(id.toString());  
            });
        });
        new_array.push(template_array);
        let thirty_min_block_before_reservation = new Reservation({
            date_of_visit: date,
            time: thirty_min_block_before,
            tableID: new_array,
        });
        //Add them into Reservation Database
        Reservation.insertMany([
            selected_timing_reservation,
            thirty_min_block_before_reservation,
            thirty_min_block_after_reservation,
        ])
            .then(function () {
                check_success = true;
                console.log(
                    "Data successfully inserted into Reservation Database for all three necessary timings"
                );
            })
            .catch(function (error) {
                console.log(
                    "Error during insertion of data into Reservation Database for all three necessary timings"
                );
            });
    }
};

//This function is to UPDATE the Reservation Data for the extreme timings: 1200 and 2230
const updateReservation = async (time, new_array) => {
    await Reservation.updateOne({ time: time }, { tableID: new_array })
        .then(function () {
            console.log(
                "Successfully updated the data for the timing: " + time
            );
        })
        .catch(function (error) {
            console.log(
                "Error occurred while updating the data for the timing: " + time
            );
        });
};

//This function is to UPDATE the User Data
const updateUser = async (id , new_status) => {
    await User.updateOne({_id: id} , {status:new_status})
        .then(function(){
            console.log(
                "Successfully updated the status of the user"
            );
        })
        .catch(function(error){
            console.log(
                "Error occurred while updating the status of the user"
            );
        });
}       

//This function deals with handling the data with Reservation database when there are reservations made on the selected date
const HandleReservationPresent = (
    date,
    time,
    thirty_min_block_after,
    thirty_min_block_before,
    table_ID,
    received_dictionary
) => {
    if (time === starting_hour) {
        //thirty_min_block_after is going to be "1230" and thirty_min_block_before is "" so we don't have to care about the latter
        let check_time_exist = 0;
        let check_next_block_exist = 0;
        if (time in received_dictionary) {
            ++check_time_exist;
            //The selected timing has reservation data
            //We need to update the data instead of creating a new data
            table_ID.map(function (id_array) {
                received_dictionary[time].push(id_array);
            });
            updateReservation(time, received_dictionary[time]);
        }
        if (thirty_min_block_after in received_dictionary) {
            ++check_next_block_exist;
            table_ID.map(function (id_array) {
                received_dictionary[thirty_min_block_after].push(id_array);
            });
            updateReservation(
                thirty_min_block_after,
                received_dictionary[thirty_min_block_after]
            );
        }
        if (check_time_exist === 0 && check_next_block_exist === 1) {
            //Selected time has no reservations and 30min next block has reservation and already updated
            //We just need to insert in the new data with same table ids for selected timing
            let add_reservation = new Reservation({
                date_of_visit: date,
                time: time,
                tableID: table_ID,
            });
            try {
                add_reservation.save();
                console.log(
                    "Only the timing: " +
                        time +
                        " had no reservations so new data was created into Reservation Database successfully"
                );
            } catch (error) {
                const err = new HttpError(
                    "Error during insertion of data into Reservation Database",
                    500
                );
                return next(err);
            }
        }
        if (check_time_exist === 1 && check_next_block_exist === 0) {
            //Selected time had reservations and already updated but the next 30min block had no reservations at all
            //We just need to insert in the new data with same table ids for the next 30min block
            let add_reservation = new Reservation({
                date_of_visit: date,
                time: thirty_min_block_after,
                tableID: table_ID,
            });
            try {
                add_reservation.save();
                console.log(
                    "Only the timing: " +
                        thirty_min_block_after +
                        " had no reservations so new data was created into Reservation Database successfully"
                );
            } catch (error) {
                const err = new HttpError(
                    "Error during insertion of data into Reservation Database",
                    500
                );
                return next(err);
            }
        }
        if (check_time_exist === 0 && check_next_block_exist === 0) {
            //Both the timings do not exist in the database
            //Create new data for both of them and add into database
            let selected_time_reservation = new Reservation({
                date_of_visit: date,
                time: time,
                tableID: table_ID,
            });
            let next_block_reservation = new Reservation({
                date_of_visit: date,
                time: thirty_min_block_after,
                tableID: table_ID,
            });
            Reservation.insertMany([
                selected_time_reservation,
                next_block_reservation,
            ])
                .then(function () {
                    console.log(
                        "Newly Created Data successfully inserted into Reservation Database for 1200 and 1230 timings"
                    );
                })
                .catch(function (error) {
                    console.log(
                        "Error during insertion of Newly Created Data into Reservation Database for 1200 and 1230 timings"
                    );
                });
        }
    } else if (time === ending_hour) {
        //thirty_min_block_after is going to be "" and thirty_min_block_before is going to be "2200" so we don't have to care about the former
        let check_time_exist = 0;
        let check_before_block_exist = 0;
        if (time in received_dictionary) {
            ++check_time_exist;
            //The selected timing has reservation data
            //We need to update the data instead of creating a new data
            table_ID.map(function (id_array) {
                received_dictionary[time].push(id_array);
            });
            updateReservation(time, received_dictionary[time]);
        }
        if (thirty_min_block_before in received_dictionary) {
            ++check_before_block_exist;
            let template_array = [];
            table_ID.map(function (id_array) {
                id_array.map(function(id){
                    template_array.push(id.toString());  
                });
            });
            received_dictionary[thirty_min_block_before].push(template_array);
            updateReservation(
                thirty_min_block_before,
                received_dictionary[thirty_min_block_before]
            );
        }
        if (check_time_exist === 0 && check_before_block_exist === 1) {
            //Selected time has no reservations and 30min before block has reservation and already updated
            //We just need to insert in the new data with same table ids for selected timing
            let add_reservation = new Reservation({
                date_of_visit: date,
                time: time,
                tableID: table_ID,
            });
            try {
                add_reservation.save();
                console.log(
                    "Only the timing: " +
                        time +
                        " had no reservations so new data was created into Reservation Database successfully"
                );
            } catch (error) {
                const err = new HttpError(
                    "Error during insertion of data into Reservation Database",
                    500
                );
                return next(err);
            }
        }
        if (check_time_exist === 1 && check_before_block_exist === 0) {
            //Selected time had reservations and already updated but the next 30min block had no reservations at all
            //We just need to insert in the new data with same table ids for the next 30min block
            let template_array = [];
            let new_array = [];
            table_ID.map(function (id_array) {
                id_array.map(function(id){
                    template_array.push(id.toString());  
                });
            });
            new_array.push(template_array);
            let add_reservation = new Reservation({
                date_of_visit: date,
                time: thirty_min_block_before,
                tableID: new_array,
            });
            try {
                add_reservation.save();
                console.log(
                    "Only the timing: " +
                        thirty_min_block_before +
                        " had no reservations so new data was created into Reservation Database successfully"
                );
            } catch (error) {
                const err = new HttpError(
                    "Error during insertion of data into Reservation Database",
                    500
                );
                return next(err);
            }
        }
        if (check_time_exist === 0 && check_before_block_exist === 0) {
            //Both the timings do not exist in the database
            //Create new data for both of them and add into database
            let selected_time_reservation = new Reservation({
                date_of_visit: date,
                time: time,
                tableID: table_ID,
            });
            let template_array = [];
            let new_array = [];
            table_ID.map(function (id_array) {
                id_array.map(function(id){
                    template_array.push(id.toString());  
                });
            });
            new_array.push(template_array);
            let next_block_reservation = new Reservation({
                date_of_visit: date,
                time: thirty_min_block_before,
                tableID: new_array,
            });
            Reservation.insertMany([
                selected_time_reservation,
                next_block_reservation,
            ])
                .then(function () {
                    console.log(
                        "Newly Created Data successfully inserted into Reservation Database for 2230 and 2200 timings"
                    );
                })
                .catch(function (error) {
                    console.log(
                        "Error during insertion of Newly Created Data into Reservation Database for 2230 and 2200 timings"
                    );
                });
        }
    } else {
        //These are the rest of the timings where we need to update both +-30 min blocks
        //If the selected timing is 1230
        //Then 30 min after block will be 1300
        //Then 30 min before block will be 1200
        //Since for reservation booking -> we need the table ids to be available for selected timing & selected timing + 30
        //that means for the selected timing - 30, we just need to make sure that those table ids need to be added into the table array of the selected_timing - 30
        //meaning if the table array already have some of those table ids, just make sure to add in the remaining ids whereas make sure add all the ids for the other two
        let check_time_exist = 0;
        let check_next_block_exist = 0;
        let check_before_block_exist = 0;
        if (time in received_dictionary) {
            ++check_time_exist;
            //We need to update the data
            table_ID.map(function (id_array) {
                received_dictionary[time].push(id_array);
            });
            console.log(received_dictionary[time]);
            updateReservation(time, received_dictionary[time]);
        }
        if (thirty_min_block_after in received_dictionary) {
            ++check_next_block_exist;
            table_ID.map(function (id_array) {
                received_dictionary[thirty_min_block_after].push(id_array);
            });
            updateReservation(
                thirty_min_block_after,
                received_dictionary[thirty_min_block_after]
            );
        }
        if (thirty_min_block_before in received_dictionary) {
            ++check_before_block_exist;
            //Add the table ids in all string format because they are indicators that users cannot book those tables at that particular timing but doesn't mean that users cannot book those tables 30mins before this "before" timing
            let template_array = [];
            table_ID.map(function (id_array) {
                id_array.map(function(id){
                    template_array.push(id.toString());  
                });
            });
            received_dictionary[thirty_min_block_before].push(template_array);
            updateReservation(
                thirty_min_block_before,
                received_dictionary[thirty_min_block_before]
            );
        }
        if (
            check_time_exist === 1 &&
            check_next_block_exist === 0 &&
            check_before_block_exist === 0
        ) {
            //Selected timing has reservations and is already updated
            //The 30min next and before blocks have no reservations so we just need to add them into database
            //for 30min before block, the table ids need to be converted to string
            let next_block = new Reservation({
                date_of_visit: date,
                time: thirty_min_block_after,
                tableID: table_ID,
            });
            let template_array = [];
            let new_array = [];
            table_ID.map(function (id_array) {
                id_array.map(function(id){
                    template_array.push(id.toString());  
                });
            });
            new_array.push(template_array);
            let before_block = new Reservation({
                date_of_visit: date,
                time: thirty_min_block_before,
                tableID: new_array,
            });
            Reservation.insertMany([next_block, before_block])
                .then(function () {
                    console.log(
                        "Only next block and before block had no reservations so added data for " +
                            thirty_min_block_after +
                            " and " +
                            thirty_min_block_before +
                            " timing"
                    );
                })
                .catch(function (error) {
                    console.log(
                        "Error during insertion of data for " +
                            thirty_min_block_after +
                            " and " +
                            thirty_min_block_before +
                            " timing"
                    );
                });
        }
        if (
            check_time_exist === 0 &&
            check_next_block_exist === 1 &&
            check_before_block_exist === 0
        ) {
            //Next block exists in database and already updated
            //Add selected block and before block
            let selected_block = new Reservation({
                date_of_visit: date,
                time: time,
                tableID: table_ID,
            });
            let template_array = [];
            let new_array = [];
            table_ID.map(function (id_array) {
                id_array.map(function(id){
                    template_array.push(id.toString());  
                });
            });
            new_array.push(template_array);
            let before_block = new Reservation({
                date_of_visit: date,
                time: thirty_min_block_before,
                tableID: new_array,
            });
            Reservation.insertMany([selected_block, before_block])
                .then(function () {
                    console.log(
                        "Only selected block and before block had no reservations so added data for " +
                            time +
                            " and " +
                            thirty_min_block_before +
                            " timing"
                    );
                })
                .catch(function (error) {
                    console.log(
                        "Error during insertion of data for " +
                            time +
                            " and " +
                            thirty_min_block_before +
                            " timing"
                    );
                });
        }
        if (
            check_time_exist === 0 &&
            check_next_block_exist === 0 &&
            check_before_block_exist === 1
        ) {
            //Before block exists in database and already updated
            //Add selected timing and next block
            let selected_block = new Reservation({
                date_of_visit: date,
                time: time,
                tableID: table_ID,
            });
            let next_block = new Reservation({
                date_of_visit: date,
                time: thirty_min_block_after,
                tableID: table_ID,
            });
            Reservation.insertMany([selected_block, next_block])
                .then(function () {
                    console.log(
                        "Only selected block and next block had no reservations so added data for " +
                            time +
                            " and " +
                            thirty_min_block_after +
                            " timing"
                    );
                })
                .catch(function (error) {
                    console.log(
                        "Error during insertion of data for " +
                            time +
                            " and " +
                            thirty_min_block_after +
                            " timing"
                    );
                });
        }
        if (
            check_time_exist === 1 &&
            check_next_block_exist === 1 &&
            check_before_block_exist === 0
        ) {
            //Selected timing and next block exist in database and already updated
            //Add the before block
            let template_array = [];
            let new_array = [];
            table_ID.map(function (id_array) {
                id_array.map(function(id){
                    template_array.push(id.toString());  
                });
            });
            new_array.push(template_array);
            let before_block = new Reservation({
                date_of_visit: date,
                time: thirty_min_block_before,
                tableID: new_array,
            });
            try {
                before_block.save();
                console.log(
                    "Only the timing: " +
                        thirty_min_block_before +
                        " had no reservations so new data was created into Reservation Database successfully"
                );
            } catch (error) {
                const err = new HttpError(
                    "Error during insertion of data into Reservation Database",
                    500
                );
                return next(err);
            }
        }
        if (
            check_time_exist === 0 &&
            check_next_block_exist === 1 &&
            check_before_block_exist === 1
        ) {
            //Next block and before block have exist in database and already updated
            //Add the selected timing
            let selected_block = new Reservation({
                date_of_visit: date,
                time: time,
                tableID: table_ID,
            });
            try {
                selected_block.save();
                console.log(
                    "Only the timing: " +
                        time +
                        " had no reservations so new data was created into Reservation Database successfully"
                );
            } catch (error) {
                const err = new HttpError(
                    "Error during insertion of data into Reservation Database",
                    500
                );
                return next(err);
            }
        }
        if (
            check_time_exist === 1 &&
            check_next_block_exist === 0 &&
            check_before_block_exist === 1
        ) {
            //Selected block and before block exist in database and already updated
            //Add the next block
            let next_block = new Reservation({
                date_of_visit: date,
                time: thirty_min_block_after,
                tableID: table_ID,
            });
            try {
                next_block.save();
                console.log(
                    "Only the timing: " +
                        thirty_min_block_after +
                        " had no reservations so new data was created into Reservation Database successfully"
                );
            } catch (error) {
                const err = new HttpError(
                    "Error during insertion of data into Reservation Database",
                    500
                );
                return next(err);
            }
        }
        if (
            check_time_exist === 0 &&
            check_next_block_exist === 0 &&
            check_before_block_exist === 0
        ) {
            //All the selected block , next and before blocks do not exist in database
            //Just add all of them into database
            let selected_block = new Reservation({
                date_of_visit: date,
                time: time,
                tableID: table_ID,
            });
            let next_block = new Reservation({
                date_of_visit: date,
                time: thirty_min_block_after,
                tableID: table_ID,
            });
            let template_array = [];
            let new_array = [];
            table_ID.map(function (id_array) {
                id_array.map(function(id){
                    template_array.push(id.toString());  
                });
            });
            new_array.push(template_array);
            let before_block = new Reservation({
                date_of_visit: date,
                time: thirty_min_block_before,
                tableID: new_array,
            });
            Reservation.insertMany([selected_block, next_block, before_block])
                .then(function () {
                    console.log(
                        "All the timings: " +
                            time +
                            " " +
                            thirty_min_block_after +
                            " " +
                            thirty_min_block_before +
                            " do not exist in Reservation Database so they were successfully added into Database"
                    );
                })
                .catch(function (error) {
                    console.log(
                        "Error during insertion of data for " +
                            time +
                            " , " +
                            thirty_min_block_after +
                            " and " +
                            thirty_min_block_before +
                            " timings"
                    );
                });
        }
    }
};

//This function is to check if there is at least one two pax or four pax table can be used for booking for pax 1 ,2 , 3 or 4
const check_availability_no_combination = (
    selected_time_table_array,
    thirty_min_block_after_table_array,
    respective_table_array_constant
) => {
    let template_array = [];
    let return_array = [];
    if (
        selected_time_table_array.length === 0 &&
        thirty_min_block_after_table_array.length > 0
    ) {
        //Selected time has no reservation and 30 min block after has reservation
        //Check if at least one optimum combination does not exist in table array of 30 min block after
        let thirty_min_block_after_table_array_numbers = [];
        thirty_min_block_after_table_array.map(function(id_array){
            id_array.map(function(each_id){
                thirty_min_block_after_table_array_numbers.push(each_id);
            });
        });
        for (let i = 0; i < respective_table_array_constant.length; i++) {
            let id_check = respective_table_array_constant[i];
            if (!thirty_min_block_after_table_array_numbers.includes(id_check)) {
                //This table id is not used during this 30 min block after so it can be used and do need to care about the rest of the table ids
                template_array.push(id_check);
                return_array.push(template_array);
                break;
            }
        }
    } else if (
        selected_time_table_array.length > 0 &&
        thirty_min_block_after_table_array.length === 0
    ) {
        //Selected time has reservation and 30 min block after has no reservation
        //Check if at least one optimum combination does not exist in table array of selected timing
        let selected_time_table_array_numbers = [];
        selected_time_table_array.map(function(id_array){
            id_array.map(function(each_id){
                selected_time_table_array_numbers.push(each_id);
            });
        });
        for (let i = 0; i < respective_table_array_constant.length; i++) {
            let id_check = respective_table_array_constant[i];
            if (!selected_time_table_array_numbers.includes(id_check)) {
                //This table id is not used during this selected timing so it can be used and do need to care about the rest of the table ids
                template_array.push(id_check);
                return_array.push(template_array);
                break;
            }
        }
    } else if (
        selected_time_table_array.length === 0 &&
        thirty_min_block_after_table_array.length === 0
    ) {
        //Turns out both timings have no reservations made at all. We can just use the first table
        template_array.push(respective_table_array_constant[0]);
        return_array.push(template_array);
    } else {
        //Both selected time and 30 min block after has reservation
        //Find the first optimum table id that does not exist in both selected time and 30 min block after table arrays
        let thirty_min_block_after_table_array_numbers = [];
        thirty_min_block_after_table_array.map(function(id_array){
            id_array.map(function(each_id){
                thirty_min_block_after_table_array_numbers.push(each_id);
            });
        });
        let selected_time_table_array_numbers = [];
        selected_time_table_array.map(function(id_array){
            id_array.map(function(each_id){
                selected_time_table_array_numbers.push(each_id);
            });
        });
        for (let i = 0; i < respective_table_array_constant.length; i++) {
            let id_check = respective_table_array_constant[i];
            if (
                !selected_time_table_array_numbers.includes(id_check) &&
                !thirty_min_block_after_table_array_numbers.includes(id_check)
            ) {
                template_array.push(id_check);
                return_array.push(template_array);
                break;
            }
        }
    }
    return return_array;
};

//This function is to check if there is at least one optimum table combination that can be used for booking for pax 3 , 4 , 5 , 6 , 7, , 8 , 9 or 10 pax
const check_availability_combination = (
    selected_time_table_array,
    thirty_min_block_after_table_array,
    respective_optimum_combination
) => {
    let template_array = [];
    let return_array = [];
    if (
        selected_time_table_array.length === 0 &&
        thirty_min_block_after_table_array.length > 0
    ) {
        //Selected timing has no reservation but the 30 mins block after has reservation
        //Find the first optimum table combination that can be used -> the combination ids do not exist in the table array for 30 min block after
        let thirty_min_block_after_table_array_numbers = [];
        thirty_min_block_after_table_array.map(function(id_array){
            id_array.map(function(each_id){
                thirty_min_block_after_table_array_numbers.push(each_id);
            });
        });
        for (let i = 0; i < respective_optimum_combination.length; i++) {
            let current_optimum_combination = respective_optimum_combination[i];
            let check_not_exist = 0;
            for (let j = 0; j < current_optimum_combination.length; j++) {
                let check_id = current_optimum_combination[j];
                if (!thirty_min_block_after_table_array_numbers.includes(check_id)) {
                    //One of the optimum combination id does not exist in 30 min block after table array
                    ++check_not_exist;
                }
            }
            if (check_not_exist === current_optimum_combination.length) {
                //This particular combination can be used and add those ids into return array
                //We don't need to care about rest of the combination
                current_optimum_combination.map(function (id) {
                    template_array.push(id);
                });
                return_array.push(template_array);
                break;
            } else {
                continue;
            }
        }
    } else if (
        selected_time_table_array.length > 0 &&
        thirty_min_block_after_table_array.length === 0
    ) {
        //Selected timing has reservation but the 30mins block after has no reservation
        //Find the first optimum table combination that can be used -> the combination ids do not exist in the table array for selected timing
        let selected_time_table_array_numbers = [];
        selected_time_table_array.map(function(id_array){
            id_array.map(function(each_id){
                selected_time_table_array_numbers.push(each_id);
            });
        });
        for (let i = 0; i < respective_optimum_combination.length; i++) {
            let current_optimum_combination = respective_optimum_combination[i];
            let check_not_exist = 0;
            for (let j = 0; j < current_optimum_combination.length; j++) {
                let check_id = current_optimum_combination[j];
                if (!selected_time_table_array_numbers.includes(check_id)) {
                    //One of the optimum combination id does not exist in selected time table array
                    ++check_not_exist;
                }
            }
            if (check_not_exist === current_optimum_combination.length) {
                //This particular combination can be used and add those ids into return array
                //We don't need to care about rest of the combination
                current_optimum_combination.map(function (id) {
                    template_array.push(id);
                });
                return_array.push(template_array);
                break;
            } else {
                continue;
            }
        }
    } else if (
        selected_time_table_array.length === 0 &&
        thirty_min_block_after_table_array.length === 0
    ) {
        //Turns out both selected timing and 30 min block after have no reservations made at all
        //Just use the first optimum combination
        template_array = respective_optimum_combination[0];
        return_array.push(template_array);
    } else {
        //Both selected timing and 30 min block after has reservations made
        //Find the first optimum combination which the IDs are not present in both selected timing and 30 min block after table arrays
        let thirty_min_block_after_table_array_numbers = [];
        thirty_min_block_after_table_array.map(function(id_array){
            id_array.map(function(each_id){
                thirty_min_block_after_table_array_numbers.push(each_id);
            });
        });
        let selected_time_table_array_numbers = [];
        selected_time_table_array.map(function(id_array){
            id_array.map(function(each_id){
                selected_time_table_array_numbers.push(each_id);
            });
        });
        for (let i = 0; i < respective_optimum_combination.length; i++) {
            let current_optimum_combination = respective_optimum_combination[i];
            let check_not_exist = 0;
            for (let j = 0; j < current_optimum_combination.length; j++) {
                let check_id = current_optimum_combination[j];
                if (
                    !selected_time_table_array_numbers.includes(check_id) &&
                    !thirty_min_block_after_table_array_numbers.includes(check_id)
                ) {
                    ++check_not_exist;
                }
            }
            if (check_not_exist === current_optimum_combination.length) {
                //This particular combination can be used for both the timings
                //Use this combination and we do not care about the rest of the combination
                current_optimum_combination.map(function (id) {
                    template_array.push(id);
                });
                return_array.push(template_array);
                break;
            } else {
                continue;
            }
        }
    }
    return return_array;
};

//This function is to retrieve optimum table IDs to be used to book for selected timing and 30 mins after selected timing based on the number of pax
const retrieveTableID = (
    key_list,
    received_dictionary,
    pax,
    time,
    thirty_min_block_after
) => {
    let return_array = [];
    let selected_time_table_array = [];
    let thirty_min_block_after_table_array = [];
    if (key_list.includes(time)) {
        //The selected timing has reservation made
        selected_time_table_array = received_dictionary[time];
    }
    if (key_list.includes(thirty_min_block_after)) {
        //The 30 min block after the selected timing has reservation made
        thirty_min_block_after_table_array =
            received_dictionary[thirty_min_block_after];
    }
    if (pax === 1 || pax === 2) {
        return_array = check_availability_no_combination(
            selected_time_table_array,
            thirty_min_block_after_table_array,
            two_pax_table
        );
    } else if (pax === 3 || pax === 4) {
        let template_array = check_availability_no_combination(
            selected_time_table_array,
            thirty_min_block_after_table_array,
            four_pax_table
        );
        if (template_array.length === 1) {
            //Contain at least one 4 pax table can be booked
            return_array = template_array;
        } else {
            //All the 4 pax tables cannot be used to book at the selected timing
            //Find the table ids from the optimum combination
            let optimum_combination = combine_rule[pax];
            return_array = check_availability_combination(
                selected_time_table_array,
                thirty_min_block_after_table_array,
                optimum_combination
            );
        }
    } else {
        //It will be either 5 , 6  , 7 , 8 , 9 or 10 pax here
        //We will need to use optimum combinations only
        let optimum_combination = combine_rule[pax];
        return_array = check_availability_combination(
            selected_time_table_array,
            thirty_min_block_after_table_array,
            optimum_combination
        );
    }
    return return_array;
};

const handleReservation = async(
    key_list_length,
    key_list,
    received_dictionary,
    email,
    name,
    phoneNumber,
    pax,
    date,
    time,
    res
) => {
    let time_converted = time_converter_another(time, time.substring(2, 4));
    let thirty_min_block_after = time_converted[0];
    let thirty_min_block_before = time_converted[1];
    if (key_list_length === 0) {
        //If the code reaches here means there is no reservations made on "date_of_visit" indicated by the user
        //We can just directly book for the given timing
        //We can just give the first optimum table combination for respective pax since there are no tables booked at all on the selected date
        let template_ID = [];
        let table_ID = [];
        if (pax === 1 || pax === 2) {
            //If code reaches here, just give them first 2 pax table which is table ID 1
            template_ID.push(two_pax_table[0]);
            table_ID.push(template_ID);
        } else if (pax === 3 || pax === 4) {
            //If code reaches here, just give them first 4 pax table which is tableID 8
            template_ID.push(four_pax_table[0]);
            table_ID.push(template_ID);
        } else {
            //If code reaches here, just give them the first most optimum combination based on pax
            let most_optimum_combination = combine_rule[pax][0];
            table_ID.push(most_optimum_combination);
        }
        HandleNoReservationPresent(
            date,
            time,
            thirty_min_block_after,
            thirty_min_block_before,
            table_ID
        );
        let user_table_id = table_ID[0];
        await HandleUserData(email, name, phoneNumber , date, time, user_table_id, 1, pax, res);
    } else {
        //If the code reaches here, it means that there are reservations made on the indicated date of visit
        //Since GetAvailableTiming function already helped us to validate if that particular timing is available to be booked -> which means it HAS the optimum combination
        //available to be booked throughout the current timing and 30 minutes block after the current timing
        let table_ID = retrieveTableID(
            key_list,
            received_dictionary,
            pax,
            time,
            thirty_min_block_after
        );
        HandleReservationPresent(
            date,
            time,
            thirty_min_block_after,
            thirty_min_block_before,
            table_ID,
            received_dictionary
        );
        let user_table_id = table_ID[0];
        await HandleUserData(email, name, phoneNumber, date, time, user_table_id, 1, pax, res);
    }
};

module.exports = {
    time_converter_another,
    handleReservation,
    HandleNoReservationPresent,
    updateReservation,
    updateUser
};