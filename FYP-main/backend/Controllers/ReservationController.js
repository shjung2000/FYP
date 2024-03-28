const HttpError = require("../Models/http-error");

const { validationResult } = require("express-validator");
// for sending confirmation email upon reservation

const { sendConfirmation } = require("../HelperFunctions/EmailFunctions");
const Reservation = require("../Models/ReservationModel");
const User = require("../Models/UserModel");

const {
    convertToDateTimeFormat,
    convertToDateTimeObject,
} = require("../HelperFunctions/DateTimeFormattingFunctions");

const {
    timing_combination_check,
    timing_no_combination_check,
} = require("../HelperFunctions/GetAvailableTimingHelper");

const {
    handleReservation,
    updateReservation,
    updateUser
} = require("../HelperFunctions/CreateReservationHelper");

const {
    two_pax_table,
    four_pax_table,
} = require("../Constants/TwoFourPaxTables");

const {
    starting_hour,
    ending_hour
} = require("../Constants/OperatingTime");

const { combine_rule } = require("../Constants/CombineRule");

const { json } = require("body-parser");

require("dotenv").config();

const {
    time_converter_another,
} = require("../HelperFunctions/CreateReservationHelper");

const adminInterfaceLink = process.env.ADMIN_INTERFACE;

//Start of SangHil's create reservation function
const createReservationNew = async (req, res, next) => {
    const { email, name, phone , pax, date_of_visit, time } = req.body;
    console.log({
        email,
        phone,
        name,
        pax,
        date_of_visit,
        time,
    });
    //Retrieve rows that match the date = date_of_visit
    try {
        reservations_match_date = await Reservation.find({
            date_of_visit: date_of_visit,
        }).exec();
    } catch (error) {
        const err = new HttpError(
            "Something went wrong while fetching data",
            500
        );
        return next(err);
    }
    let received_dictionary = {};
    reservations_match_date.forEach(function (object) {
        received_dictionary[object.time] = object.tableID;
    });
    let key_list = Object.keys(received_dictionary);
    handleReservation(
        key_list.length,
        key_list,
        received_dictionary,
        email,
        name,
        phone,
        pax,
        date_of_visit,
        time,
        res
    );
};
//End of SangHil's create reservation function

//Start of SangHil's new findAvailableTiming function
const findAvailableTimingNew = async (req, res, next) => {
    let { date, pax } = req.body;
    //Retrieve rows that match the date = date_of_visit
    try {
        reservations_match_date = await Reservation.find({
            date_of_visit: date,
        }).exec();
    } catch (error) {
        const err = new HttpError(
            "Something went wrong while fetching data",
            500
        );
        return next(err);
    }
    let received_dictionary = {};
    reservations_match_date.forEach(function (object) {
        received_dictionary[object.time] = object.tableID;
    });
    let key_list = Object.keys(received_dictionary);
    let return_array = [];
    console.log(pax);
    console.log(received_dictionary);
    if (key_list.length === 0) {
        //If the code reaches here that means the dictionary is empty which means there is no reservations made on that particular date
        //We can just simply return an empty return_array
        return res.json(return_array);
    } else {
        //If the code reaches here means the dictionary is not empty and contains at least one reservation made at a particular timing
        if (pax === 1 || pax === 2) {
            //If the code reaches here means that the pax indicated is 1 or 2 so we need to use two_pax_table array to evaluate if one table from that is available
            return_array = timing_no_combination_check(
                key_list,
                received_dictionary,
                two_pax_table
            );
            if (return_array.length > 0) {
                //Code reaches here means that there are timings to be blocked out
                return res.json(return_array);
            }
            //Code reaches here means there are no timings to be blocked out
            return res.json(return_array);
        } else if (pax === 3 || pax === 4) {
            //If the code reaches here means that the pax indicated is 3 or 4 so we need to use four_pax_table array to evaluate if one table from that is available first
            //because we need to prioritize 4 pax table first
            let template_array = timing_no_combination_check(
                key_list,
                received_dictionary,
                four_pax_table
            );
            if (template_array.length > 0) {
                //The timings stored inside this array are the ones that cannot use any of the four pax tables to cater to 3 and 4 pax
                //We need to now consider the optimum combinations now for the timings inside this template_array now
                return_array = timing_combination_check(
                    template_array,
                    received_dictionary,
                    combine_rule[pax]
                );
                if (return_array.length > 0) {
                    //Code reaches here means that there are timings to be blocked out
                    return res.json(return_array);
                }
                //Code reaches here means that there are no timings to be blocked out
                return res.json(return_array);
            } else {
                //No timings stored inside which means that all timings were able to be booked because there was at least one available 4 pax table that could be used
                //for all the timings
                return res.json(return_array);
            }
        } else {
            //If the code reaches here means that the pax indicated is 5 , 6 , 7 , 8 , 9 or 10. Since from 5 pax onwards we have to use the optimum combination tables
            //no matter what we can straight away validating using optimum combination tables
            return_array = timing_combination_check(
                key_list,
                received_dictionary,
                combine_rule[pax]
            );
            if (return_array.length > 0) {
                return res.json(return_array);
            }
            return res.json(return_array);
        }
    }
};
//End of SangHil's new findAvailableTiming function





//SangHil's new Reservation Cancellation function
const cancelReservation = async(req , res) => {
    const { reservationId } = req.params;
    try{
        const UserReservation = await User.findById(reservationId);
        if( !UserReservation ){
            return res.status(404).json({
                message: "User not found"
            });
        }
        //get the date , time & tableIds of the retrieved UserReservation
        const {
            date_of_visit,
            time,
            tableID: tableIDsToDelete,
        } = UserReservation;
        let convertedBlocks = time_converter_another(
            time,
            time.substring(2,4)
        )
        let thirty_min_block_after = convertedBlocks[0];
        let thirty_min_block_before = convertedBlocks[1];
        if(time === starting_hour){
            //We need to update for the table ids for 1200 and 1230 in Reservation Database
            //thirty_min_block_before will be empty string so ignore
            Reservation.find( {time:time , date_of_visit: date_of_visit} ).exec()
                .then(reservation_row_selected_time => {
                    let selected_time_table_IDs = reservation_row_selected_time[0].tableID;
                    console.log(selected_time_table_IDs);
                    console.log(tableIDsToDelete);
                    let selected_time_block_new_array = selected_time_table_IDs.filter(
                        function(table_array){return !(compareArraysByToString(table_array , tableIDsToDelete) && compareArraysByJSON(table_array , tableIDsToDelete))}
                    )
                    console.log(selected_time_block_new_array);
                    updateReservation(time , selected_time_block_new_array);
                    console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                    Reservation.find( {time:thirty_min_block_after , date_of_visit: date_of_visit} ).exec()
                        .then(reservation_row_thirty_min_next_block => {
                            let thirty_min_next_block_table_IDs = reservation_row_thirty_min_next_block[0].tableID;
                            console.log(thirty_min_next_block_table_IDs);
                            console.log(tableIDsToDelete);
                            let thirty_min_block_after_new_array = thirty_min_next_block_table_IDs.filter(
                                function(table_array){return !(compareArraysByToString(table_array , tableIDsToDelete) && compareArraysByJSON(table_array , tableIDsToDelete))}
                            );
                            console.log(thirty_min_block_after_new_array);
                            updateReservation(thirty_min_block_after , thirty_min_block_after_new_array);
                    })
            });
        }else if(time === ending_hour){
            //We need to update for the table ids for 2230 and 2200 in Reservation Database
            //thirty_min_block_after will be empty string so ignore
            Reservation.find( {time:time , date_of_visit:date_of_visit} ).exec()
                .then(reservation_row_selected_time => {
                    let selected_time_table_IDs = reservation_row_selected_time[0].tableID;
                    console.log(selected_time_table_IDs);
                    console.log(tableIDsToDelete);
                    let selected_time_block_new_array = selected_time_table_IDs.filter(
                        function(table_array){return !(compareArraysByToString(table_array , tableIDsToDelete) && compareArraysByJSON(table_array , tableIDsToDelete))}
                    )
                    console.log(selected_time_block_new_array);
                    updateReservation(time , selected_time_block_new_array);
                    console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                    Reservation.find( {time:thirty_min_block_before , date_of_visit: date_of_visit} ).exec()
                    .then(reservation_row_thirty_min_block_before => {
                        let thirty_min_before_block_table_IDs = reservation_row_thirty_min_block_before[0].tableID;
                        console.log(thirty_min_before_block_table_IDs);
                        console.log(tableIDsToDelete);
                        let thirty_min_block_before_new_array = thirty_min_before_block_table_IDs.filter(
                            function(table_array){return !(compareArraysByToString(table_array , tableIDsToDelete) && !compareArraysByJSON(table_array , tableIDsToDelete))}
                        );
                        console.log(thirty_min_block_before_new_array);
                        updateReservation(thirty_min_block_before , thirty_min_block_before_new_array);
                    });
                });
        }else{
            //We need to update for the table ids for the selected time and +-30mins of the selected time
            //Just combine the above logics
            Reservation.find( {time:time , date_of_visit: date_of_visit} ).exec()
                .then(reservation_row_selected_time => {
                    let selected_time_table_IDs = reservation_row_selected_time[0].tableID;
                    console.log(selected_time_table_IDs);
                    console.log(tableIDsToDelete);
                    let selected_time_block_new_array = selected_time_table_IDs.filter(
                        function(table_array){return !(compareArraysByToString(table_array , tableIDsToDelete) && compareArraysByJSON(table_array , tableIDsToDelete))}
                    )
                    console.log(selected_time_block_new_array);
                    updateReservation(time , selected_time_block_new_array);
                    console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                    Reservation.find( {time:thirty_min_block_after , date_of_visit: date_of_visit} ).exec()
                        .then(reservation_row_thirty_min_next_block => {
                            let thirty_min_next_block_table_IDs = reservation_row_thirty_min_next_block[0].tableID;
                            console.log(thirty_min_next_block_table_IDs);
                            console.log(tableIDsToDelete);
                            let thirty_min_block_after_new_array = thirty_min_next_block_table_IDs.filter(
                                function(table_array){return !(compareArraysByToString(table_array , tableIDsToDelete) && compareArraysByJSON(table_array , tableIDsToDelete))}
                            );
                            console.log(thirty_min_block_after_new_array);
                            updateReservation(thirty_min_block_after , thirty_min_block_after_new_array);
                            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                            Reservation.find( {time:thirty_min_block_before , date_of_visit: date_of_visit} ).exec()
                            .then(reservation_row_thirty_min_block_before => {
                                let thirty_min_before_block_table_IDs = reservation_row_thirty_min_block_before[0].tableID;
                                console.log(thirty_min_before_block_table_IDs);
                                console.log(tableIDsToDelete);
                                let thirty_min_block_before_new_array = thirty_min_before_block_table_IDs.filter(
                                    function(table_array){return !(compareArraysByToString(table_array , tableIDsToDelete) && !compareArraysByJSON(table_array , tableIDsToDelete))}
                                );
                                console.log(thirty_min_block_before_new_array);
                                updateReservation(thirty_min_block_before , thirty_min_block_before_new_array);
                            });
                    })
            });
        }
        updateUser(reservationId, 0);
        // return res.status(200);
        return res.json({message:'Deleted Successfully'});
    }catch (err) {
        console.warn(err);
        return res.status(500).json({
            message: "Failed to delete",
        });
    }
};
//End of SangHil's new Reservation Cancellation function


//Cancel Reservation Helper Function
const compareArraysByToString = (a , b ) => {
    return a.toString() === b.toString();
};

const compareArraysByJSON = ( a , b ) => {
    return JSON.stringify(a) === JSON.stringify(b);
}
//End of Cancel Reservation Helper Function


//Start of SangHil's getTableCombination function
const getTableCombination = async (req , res , next) => {
    const {date , time} = req.body;
    //Retrieve rows that match the date = date_of_visit
    try {
        reservation_match_date = await Reservation.find({
            date_of_visit: date,
            time: time
        }).exec();
    } catch (error) {
        const err = new HttpError(
            "Something went wrong while fetching data",
            500
        );
        return next(err);
    }
    let return_dict = {};
    let return_array = [];
    //key will be the Time
    //value will be the array that contains all the table combinations that need to be blocked
    if(reservation_match_date.length === 0){
        return res.json(return_array);
    }else{
        reservation_match_date.forEach(function(object){
            return_dict[object.time] = object.tableID;
        });
        for(let [key , value] of Object.entries(return_dict)){
            console.log(key , value);
            let filter_array = [];
            let temp_array = [];
            value.map(function(each_array_id){
                each_array_id.map(function(id){
                    if(typeof id === "string"){
                        temp_array.push(parseInt(id));
                    }else{
                        temp_array.push(id);
                    }
                })
            });
            let set = new Set(temp_array);
            let compare_array = Array.from(set);
            //Filter out the array that contains the string typed id
            for(let i = 0 ; i < value.length ; i++){
                let each_array = value[i];
                if(typeof each_array[0] === "string"){
                    continue;
                }else{
                    filter_array.push(each_array);
                }
            }
            for(let i = 0 ; i < filter_array.length ; i++){
                let each_array = filter_array[i];
                for(let j = 0 ; j < each_array.length ; j++){
                    let id = each_array[j];
                    if(compare_array.includes(id)){
                        let index = compare_array.indexOf(id);
                        compare_array.splice(index , 1);
                    }
                }
            }
            if(compare_array.length === 0){
                return_array = filter_array;
            }else{
                compare_array.map(function(id){
                    console.log(id + "needs to be added inside to be blocked out too");
                    let temp_array = [];
                    temp_array.push(id);
                    filter_array.push(temp_array);
                });
                return_array = filter_array;
            }
        }
    }
    console.log(return_array);
    return res.json(return_array);
};
//End of SangHil's getTableCombination function


const getAllTImingList = async(req , res , next) => {
    let start = starting_hour;
    let end = ending_hour;

    console.log(start , end);

    let return_list = [];
    
    let contain_number = [];

    let start_converted_check = 0;
    let start_string;
    if(start.slice(2 , 4) === "30"){            //start = 0730
        ++start_converted_check;
        start_string = start.slice(0 , 2) + "00";   //start_string = 0700
    }else{
        start_string = start;
    }

    let end_converted_check = 0;
    let end_string;
    if(end.slice(2 , 4)=== "30"){               //end = 2230
        ++end_converted_check;
        end_string = end.slice(0 , 2) + "00";     //end_string = 2200
    }else{
        end_string = end;
    }


    let start_number;
    
    if(start[0] === "0"){
        start_number = parseInt(start_string.slice(1 , 4));  //700
    }else{
        start_number = parseInt(start_string.slice(0 , 4));   //1200
    }
    let end_number = parseInt(end_string.slice(0 ,4));   //2200 -> because first digit for end time will never be 0

    for(let i = start_number ; i < end_number + 1 ; i+=100){
        contain_number.push(i);   //700 , 800 , 900 , 1000 ,.... , 2200 (int type)
    }

    for(let i = 0 ; i < contain_number.length ; i++){
        let each_number_string = contain_number[i].toString();
        if(each_number_string.length === 3){
            //0700 , 0800 , 0900
            let change_format = "0" + each_number_string;
            return_list.push(change_format);
        }else{
            //1000 , 1100 , 1200 , 1300 ,....
            return_list.push(each_number_string);
        }
    }
   
    //return_array -> [0700 , 0800 , 0900 , 1000, 1100 , 1200 , ... , 2200] where each elements inside are string type
    if(start_converted_check === 1){
        //replace first element with start value
        return_list.shift();
        return_list.unshift(start);   //[0730 , 0800 , 0900 , 1000 , 1100 , 1200 , ... , 2200]
    }

    if(end_converted_check === 1){
        return_list.push(end);          //[0730 , 0800 , 0900 , 1000 , 1100 , 1200 , ... , 2200 , 2230]
    }

    for(let i = 0 ; i < return_list.length ; i++){
        let each_timing = return_list[i];
        if(each_timing.slice(2 , 4) === "00" && each_timing !== end && return_list[i+1] !== end){
            let half_hour_gap = each_timing.slice(0 , 2) + "30";
            return_list.splice(i+1 , 0 , half_hour_gap);
        }else{
            continue;
        }
    }
    
    res.json(return_list);
        
}


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------//























































let checkSubset = (parentArray, subsetArray) => {
    return subsetArray.every((el) => {
        return parentArray.includes(el);
    });
};








// ========================main functions========================
const findAvailableTiming = async (req, res, next) => {
    // find bookings of the given time
    const error = validationResult(req);

    if (!error.isEmpty()) {
        const err = new HttpError("Invalid inputs passed", 422);
        return next(err);
    }

    const { date, pax } = req.body;

    let date_input = date;
    let num_pax = pax;
    let reservations;

    try {
        reservations = await Reservation.find({});
    } catch (error) {
        const err = new HttpError(
            "Something went wrong while fetching data",
            500
        );
        return next(err);
    }

    // get all reservations that matches the date
    // dictionary be like:
    timingTableDict = {};
    return_list = [];
    // timing: [tableNo]

    // take all tables at said timing
    for (let i = 0; i < reservations.length; i++) {
        const { table_id, date_of_visit } = reservations[i].toObject();
        const [date_fetched, timing_fetched] = date_of_visit.split(" ");

        if (date_fetched == date_input) {
            // check if inside dict
            if (!timingTableDict.hasOwnProperty(timing_fetched)) {
                timingTableDict[timing_fetched] = table_id;
            } else {
                temp = timingTableDict[timing_fetched];
                timingTableDict[timing_fetched] = temp.concat(table_id);
            }
        }
    }
    // check each timing against all the combis
    var combinations = [];
    if (pax < 3) {
        two_pax_table.forEach((table) => {
            combinations.push([table]);
        });
    } else if (pax < 5) {
        two_pax_table.forEach((table) => {
            combinations.push([table]);
        });
        combinations = combinations.concat(combine_rule[pax]);
    } else {
        combinations = combine_rule[pax];
    }
    for (const timing in timingTableDict) {
        let availableCombi = [];
        combinations.forEach((combination) => {
            let available = true;
            for (let i = 0; i < combination.length; i++) {
                if (timingTableDict[timing].includes(combination[i])) {
                    available = false;
                    continue;
                }
            }
            if (available) {
                availableCombi.push(combination);
            }
        });
        if (availableCombi.length == 0) {
            return_list.push(timing);
        }
    }
    console.log(pax, return_list);
    console.log();

    return res.json(return_list);
};

//Start of SiangMeng's create reservation function
const createReservation = async (req, res, next) => {
    const { email, name, pax, date_of_visit } = req.body;
    try {
        // filter for those that have that timing
        // 1) get the original datetime object --> original
        // 2) add 30 min to original --> dummy
        // 3) create a new reservation with original
        // 4) create reservation with dummy datetime
        // 5) send confirmation email for 3)

        const originalDateTimeInMs = Date.parse(date_of_visit);
        // first 30 min
        const originalDateTime = new Date(originalDateTimeInMs);
        const formattedOriginalDate = convertToDateTimeFormat(originalDateTime);
        const clashingReservation = await Reservation.find({
            date_of_visit: formattedOriginalDate,
        });
        let takenTables = [];
        clashingReservation.forEach((reservation) => {
            reservation.table_id.forEach((tableId) => {
                if (reservation.table_id.includes(tableId)) {
                    takenTables.push(tableId);
                }
            });
        });
        takenTables.sort(function (a, b) {
            return a - b;
        });
        console.log("takenTables", takenTables);
        let availableCombi = [];
        // check combi base on scenario
        if (pax < 3) {
            // 1 and 2
            // check 2 pax
            two_pax_table.forEach((table) => {
                if (!takenTables.includes(table)) {
                    availableCombi.push([table]);
                }
            });
        } else if (pax < 5) {
            // 3 & 4
            // check 4 pax
            four_pax_table.forEach((table) => {
                if (!takenTables.includes(table)) {
                    takenTables.push(table);
                    availableCombi.push([table]);
                }
            });
            // check 2 pax (combi)
            combine_rule[pax].forEach((combination) => {
                let available = true;
                for (let i = 0; i < combination.length; i++) {
                    if (takenTables.includes(combination[i])) {
                        available = false;
                        continue;
                    }
                    if (available) {
                        availableCombi.push(combination);
                    }
                }
            });
        } else {
            // 5 or more
            combine_rule[pax].forEach((combination) => {
                let available = true;
                for (let i = 0; i < combination.length; i++) {
                    if (takenTables.includes(combination[i])) {
                        available = false;
                        continue;
                    }
                }
                if (available) {
                    availableCombi.push(combination);
                }
            });
        }
        // sm.lee.2020@smu.edu.sg
        // 10,10, 5,8
        console.log("pax", pax);
        console.log("takenTables", takenTables);
        console.log("availableCombi", availableCombi);
        if (availableCombi.length == 0) {
            const err = new HttpError("No available tables found", 404);
            return next(err);
        } else {
            var createReservationPromises = [];
            const newReservation = new Reservation({
                email,
                name,
                pax,
                date_of_visit: formattedOriginalDate,
                table_id: availableCombi[0],
                status: 1,
            });
            console.log(
                "originalDateTime.getMinutes()",
                originalDateTime.getMinutes() == 30
            );

            // second 30 min
            const dummyDateTimeInMs = originalDateTimeInMs + 30 * 60 * 1000;
            const dummyDateTime = new Date(dummyDateTimeInMs);
            const dummyReservation = new Reservation({
                email,
                name,
                pax,
                date_of_visit: convertToDateTimeFormat(dummyDateTime),
                table_id: availableCombi[0],
                status: 1,
            });

            const createReservationPromise = await Reservation.create(
                newReservation
            );
            const createDummyReservationPromise = await Reservation.create(
                dummyReservation
            );
            createReservationPromises.push(createReservationPromise);
            createReservationPromises.push(createDummyReservationPromise);

            // check if it starts at the 2nd half hour
            if (originalDateTime.getMinutes() == 30) {
                const frontDummyDateTimeInMs =
                    originalDateTimeInMs - 30 * 60 * 1000;
                const frontDummyDateTime = new Date(frontDummyDateTimeInMs);
                const frontDummyReservation = new Reservation({
                    email,
                    name,
                    pax,
                    date_of_visit: convertToDateTimeFormat(frontDummyDateTime),
                    table_id: availableCombi[0],
                    status: 1,
                });
                const createFrontDummyReservationPromise =
                    await Reservation.create(frontDummyReservation);
                // console.log("frontDummyReservation",frontDummyReservation)
                createReservationPromises.push(
                    createFrontDummyReservationPromise
                );
            }

            // this is to ensure the confirmation email is only sent after both reservations are successfully created
            Promise.allSettled(createReservationPromises)
                .then(async (results) => {
                    // if both succeed, send email
                    const originalReservation = results[0].value;
                    // console.log("originalReservation", originalReservation);
                    await sendConfirmation(
                        originalReservation,
                        adminInterfaceLink +
                            "/reservation/view/" +
                            originalReservation._id,
                        adminInterfaceLink +
                            "/reservation/cancel/" +
                            originalReservation._id
                    )
                        .then(() => {
                            return res.json({
                                message: "Reservation created successfully",
                                data: originalReservation._id,
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
//End of SiangMeng's create reservation function

const getReservations = async (req, res, next) => {
    try {
        const results = await User.find();
        if (!results) {
            return res.status(404).json({ message: "no reservations in database" });
        }
        return res.status(200).json(results);
    } catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
};


const getReservationById = async (req, res, next) => {
    const { reservationId } = req.params;
    try {
        result = await User.findOne({_id:reservationId,status:1})
        // findById(reservationId);
        if (!result) {
            return res.status(404).json({ message: "not found" });
        }
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
};

const testEmailConfirmation = async (req, res) => {
    const fakeReservation = {
        email: "sm.lee.2020@smu.edu.sg",
        name: "Siang Meng",
        pax: 2,
        date_of_visit: new Date().toISOString(),
        table_id: "11",
    };
    await sendConfirmation(
        fakeReservation,
        adminInterfaceLink + "/reservation/cancel/" + "reservationId"
    ).then(() => {
        return res.status(200).json({
            message: "Email sent",
        });
    });
};





/*
const cancelReservation = async (req, res) => {
    const { reservationId } = req.params;
    try {
        const existingReservation = await User.findById(reservationId);
        if (!existingReservation) {
            return res.status(404).json({
                message: "Reservation not found.",
            });
        }
        // get the date, time  & tableIds of said reservation
        const {
            date_of_visit,
            time,
            tableID: tableIDsToDelete,
        } = existingReservation;
        let timingsToCheck = [time];
        let convertedBlocks = time_converter_another(
            time,
            time.substring(2, 4)
        );
        // first item is the 30 mins after
        // second item is the 30 mins before
        timingsToCheck = timingsToCheck.concat(convertedBlocks);
        let timingQuery = [];
        for (let i = 0; i < timingsToCheck.length; i++) {
            timingQuery.push({
                time: timingsToCheck[i],
            });
        }
        console.log(timingsToCheck);
        console.log(timingQuery);
        var deletePromises = [];
        const deleteReservationPromise = await User.deleteOne(
            existingReservation
        );
        deletePromises.push(deleteReservationPromise);

        await Reservation.find({ date_of_visit, $or: timingQuery }).then(
            (reservations) => {
                const tablesToDeleteSet = new Set(tableIDsToDelete);
                reservations.forEach(async (reservation) => {
                    reservation.tableID = reservation.tableID.filter(
                        (tableId) => {
                            return !tablesToDeleteSet.has(tableId);
                        }
                    );
                    reservation.save();
                    console.log(reservation.tableID.length);
                    if (reservation.tableID.length == 0) {
                        console.log("delete reservation timing");
                        const deleteReservationPromise =
                            await Reservation.deleteOne(reservation);
                        deletePromises.push(deleteReservationPromise);
                        console.log("deletePromises.length()", deletePromises.length);
                    }
                    console.log("deletePromises.length()", deletePromises.length);
                });
                console.log("deletePromises.length()", deletePromises.length);
                Promise.all(deletePromises)
                    .then(() => {
                        return res.json({ message: "Deleted successfully" });
                    })
                    .catch((err) => {
                        console.warn(err);
                        return res.status(500).json({
                            message: "Failed to delete",
                        });
                    });
            }
        );
        // return res.json({ message: "HAHA" });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({
            message: "Failed to delete",
        });
    }
};
*/

module.exports = {
    createReservationNew,
    findAvailableTimingNew,
    getReservations,
    getReservationById,
    cancelReservation,
    getTableCombination,
    getAllTImingList
};
