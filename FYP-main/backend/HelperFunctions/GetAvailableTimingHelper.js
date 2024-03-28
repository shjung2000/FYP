//SangHil's function to validate if all the optimum combination table ids are not present inside the table_id_array for a particular timing
//True means all the optimum table ids are not present and thus, those optimum combination tables can be used at that timing
//False means not all the optimum table ids are not present and thus, those optimum combination tables cannot be used at that timing
const validate_tables_can_use = (current_optimum_combination , table_id_array_for_timing_want_check) =>{
    let check_not_exist = 0;
    for(let p = 0 ; p < current_optimum_combination.length ; p++){
        let check_id = current_optimum_combination[p];
        if( !(table_id_array_for_timing_want_check.includes(check_id)) ){
            ++check_not_exist;
        }
    }
    if(check_not_exist === current_optimum_combination.length){
        //If code reaches here means that all the table ids in the current optimum_combination array are not present which means that those tables
        //are available to be booked at that particular timing
        console.log("Current Timing or next 30 minute block can use the combination " + current_optimum_combination);
        return true;
    }else{
        //If code reaches here means that some of the table ids in the current optimum_combination array are present which means those tables
        //are not available to be booked at that particular timing
        console.log("Current Timing or next 30 minute block cannot use the combination " + current_optimum_combination);
        return false;
    }
};

//SangHil's new function to return the other two timings need to be evaluated
const time_converter = (time , minutes) => {
    let return_array = [];
    let time_add_thirty_mins;
    let time_minus_thirty_mins;

    if(minutes === "30"){
        //If code reaches here, the time we receive is something like "1230"
        time_add_thirty_mins = (time + 70).toString();   //This is selected timing + 30 minutes
        time_minus_thirty_mins = (time - 30).toString();  //This is selected timing - 30 minutes
        
    }else{
        //If code reaches here, the time we receive is something like "1200"
        time_add_thirty_mins = (time + 30).toString();   //This is selected timing + 30 minutes
        time_minus_thirty_mins = (time - 30).toString();  //This is selected timing - 30 minutes 
    }

    return_array.push(time_add_thirty_mins);
    return_array.push(time_minus_thirty_mins);

    return return_array;


};

//SangHil's function to return the timings that need to be blocked out or return empty array if no timings need to be blocked out when the pax is 1 , 2 , 3 or 4
const timing_no_combination_check = (key_list , received_dictionary , fixed_table_id) => {
    let return_array = [];
    for(let i = 0 ; i < key_list.length ; i++){
        let key = key_list[i];
        let table_array_of_arrays = received_dictionary[key];
        let template_array = [];
        table_array_of_arrays.map(function(id_array){
            id_array.map(function(id){
                if(typeof id === "string"){
                    template_array.push(parseInt(id));
                }else{
                    template_array.push(id);
                }
            });
        });
        let set = new Set(template_array);
        let value = Array.from(set);
        console.log(value);
        let fail_counter = 0;
        for(let i = 0 ; i < fixed_table_id.length ; i++){
            let check_not_exist = 0;
            let compare_table_id = fixed_table_id[i];
            if( !(value.includes(compare_table_id)) ){
                ++check_not_exist;
            }
            if(check_not_exist === 0){
                //If the code reaches here that means that the particular 2 pax table id exists in the table array for particular timing
                //That particular 2 pax table is not allowed to be used at that timing
                ++fail_counter;
                continue;
            }else{
                //If the code reaches here that means that the particular 2 pax table id does not exist in the table array for particular timing
                //That particular 2 pax table can be used at that timing
                //Check if the next 30 mins block is present inside the received_dictionary
                let time_converted = time_converter(parseInt(key) , key.substring(2,4));
                let next_block_check = time_converted[0];
                if(next_block_check in received_dictionary){
                    //If the code reaches here that means that the next 30 minute block exists in received_dictionary and this means there are some
                    //reservations going on at that timing. We need to check if the particular 2 pax table also does not exist in the table id array of
                    //that next 30 min block timing
                    let next_block_table_array_of_arrays = received_dictionary[next_block_check];
                    let next_block_table_id_array = [];
                    next_block_table_array_of_arrays.map(function(id_array){
                        id_array.map(function(id){
                            next_block_table_id_array.push(id);
                        });
                    });
                    if(next_block_table_id_array.includes(compare_table_id)){
                        //If the code reaches here means that particular 2 pax table id exists in the table id array of the next 30 min block so
                        //that particular table id cannot be used to book at the timing of the current index
                        //Continue with the next timing
                        ++fail_counter;
                        continue;
                    }else{
                        //If the code reaches here means that particular 2 pax table id does not exist in the table id array of the next 30min block as well
                        //so that particular table id can be used to book at the timing of the current index
                        break;
                    }
                }else{
                    //If the code reaches here that means that the next 30 minute block has no reservations at all which means all the tables can be
                    //used for booking so the particular timing is available to be booked for pax 1 or 2
                    break;
                }
            }
        }
        if(fail_counter === fixed_table_id.length){
            //If code reaches here that means all the 2 pax table ids CANNOT be used on that particular timing -> whether the id is present inside the
            //current index timing or is present inside the next 30 minute block timing
            //The timing is not available to be booked so we need to block out
            return_array.push(key);
        }
    }
    if(return_array.length > 0){
        //Code reaches here means that there are timings that need to be blocked out
        return return_array;
    }
    return return_array;
}

//SangHil's function to return the timings that need to be blocked out or return empty array if no timings need to be blocked out for the pax 3 , 4 , 5 , 6 , 7 , 8, 9 or 10
//using the optimum combinations
const timing_combination_check = (timing_evaluate_array , received_dictionary , optimum_combination_array) => {
    let return_array = [];
    for(let i = 0 ; i < timing_evaluate_array.length ; i++){
        let timing = timing_evaluate_array[i];
        let table_array_of_arrays = received_dictionary[timing];
        let template_array = [];
        table_array_of_arrays.map(function(id_array){
            id_array.map(function(id){
                if(typeof id === "string"){
                    template_array.push(parseInt(id));
                }else{
                    template_array.push(id);
                }
            });
        });
        let set = new Set(template_array);
        let table_id_array_for_timing = Array.from(set);
        console.log(table_id_array_for_timing);
        let fail_counter = 0;
        //We need to check if there is at least one optimum combination available -> the table ids in particular combination are not present inside the
        //table_id_array_for_timing
        for(let j = 0 ; j < optimum_combination_array.length ; j++){
            let current_optimum_combination = optimum_combination_array[j];
            //current_optimum_combination looks something like this -> [7,13]
            //Now check if both 7 and 13 are present inside table_id_array_for_timing
            if(validate_tables_can_use(current_optimum_combination , table_id_array_for_timing)){
                //We can need to check the next 30 minutes block as well
                let next_block_check = time_converter(parseInt(timing) , timing.substring(2,4))[0];
                if(next_block_check in received_dictionary){
                    //If code reaches here means that the next 30 minute block of the current timing also has reservations going on
                    //We need to check if the table ids in the current_optimum_combination are also not present inside the timing array of the next 30 minute block
                    let next_block_table_array_of_arrays = received_dictionary[next_block_check];
                    let table_id_array_for_next_timing_block = [];
                    next_block_table_array_of_arrays.map(function(id_array){
                        id_array.map(function(id){
                            table_id_array_for_next_timing_block.push(id);
                        });
                    });
                    if(validate_tables_can_use(current_optimum_combination , table_id_array_for_next_timing_block)){
                        //If code reaches here means that the table ids of current optimum combination are not present inside the table id array of the next 30 minute
                        //block which means that the next 30 minute block can also cater those optimum combination tables for the indicated pax users
                        //Hence, that the current timing is available to be booked and we can move on to the next index of timing to be evaluated
                        break;
                    }else{
                        //If code reaches here means that some of table ids of current optimum combination are present inside the table id array of the next 30min
                        //block which means that the we cannot use that particular optimum combination for that timing to cater to the indicated pax
                        //Check with the next optimum combination
                        ++fail_counter;
                        continue;
                    }
                }else{
                    //If code reaches here means that the next 30 minute block of the current timing does not have any reservations going on
                    //This means that all the tables are available to be used at that timing. Hence, the current optimum_table combination can be used throughout
                    //from the current_timing and the next 30min block which means at that current_timing , it is available to be booked to cater to the indicated pax
                    //We can just move on to the next timing index
                    break;
                }
            }else{
                //If code reaches here means that some of the table ids in the current optimum_combination array are present inside the table id array of the
                //current timing -> that particular optimum_combination failed
                //Continue looping with the other optimum_combination next
                ++fail_counter;
                continue;
            }
        }
        if(fail_counter === optimum_combination_array.length){
            //If code reaches here, ALL the optimum combinations have failed for that particular timing
            //That timing needs to be blocked out for that particular pax
            return_array.push(timing);
        }
    }
    if(return_array.length > 0){
        //If code reaches here, there are timings to be blocked out
        return return_array
    }
    //If code reaches here, there are no timings to be blocked out
    return return_array;
};

module.exports = {time_converter , timing_combination_check , timing_no_combination_check , validate_tables_can_use};
