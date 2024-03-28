const HttpError = require("../Models/http-error");

const Attendance = require("../Models/AttendanceModel");

require("dotenv").config();


const pay_rate = {
    "P" : 8,
    "F": 16
}


const addEmployee = async(req , res , next) =>{
    const {name , duration , type , date} = req.body;
    let employee = new Attendance({
        name: name,
        work_duration: duration,
        date: date,
        status: type
    });
    try{
        employee.save();
        return res.json({
            message: "Successfully Created"
        })
    }catch(error){
        return res.status(500).json({
            message: "Failed to create",
        });
    }
};



const getEmployeeByDate = async(req, res , next)=> {
    let {date} = req.body;
    let return_array = [];
    // console.log("running")
    try{
        var employee_retrieved = await Attendance.find({}).exec();
    }catch(error){
        const err = new HttpError(
            "Something went wrong while fetching data",
            500
        );
        return next(err);
    }
    if(employee_retrieved.length === 0){
        return return_array;
    }else{
        for(let i = 0 ; i < employee_retrieved.length ; i++){
            let employee = employee_retrieved[i];
            if(employee.date === date){
                return_array.push(employee);
            }
        }
        return res.json(return_array);
    }
};


const deleteEmployee = async(req , res , next) => {
    const {id} = req.params;   
    try{
        result = await Attendance.findById(id).exec();
        if(!result){
            return res.status(404).json({ message: "not found" });
        }
        Attendance.deleteOne({_id : id}, function(err){
            if(err) return res.status(404).json({message: "Error while deleting"});
        })
        return res.json({message: "Successfully Deleted"});
    }catch (err) {
        return res.status(500).json({
            message: "Something went wrong while fetching data",
        });
    }
};


const updateEmployee = async(req , res , next) => {
    const {name , duration , type , date} = req.body;
    const {id} = req.params;
    await Attendance.updateOne({ _id: id }, { name: name  , work_duration: duration , date: date , status:type})
        .then(function () {
            console.log(
                "Successfully updated the data for the employee: " + name
            );
            return res.json({message: "Successfully Updated"})
        })
        .catch(function (error) {
            console.log(
                "Error occurred while updating the data for the employee: " + name
            );
            return res.json({message: "Something went wrong while updating"})
        });
}

const retrieveTotalAmount = async(req , res ,next) => {
    const{year} = req.params;
    let filter_data = [];
    let return_dict = {
        "January" : 0,
        "February": 0,
        "March": 0,
        "April": 0,
        "May":0,
        "June": 0,
        "July": 0,
        "August": 0,
        "September": 0,
        "October": 0,
        "November": 0,
        "December":0,
        "Total": 0
    };
    try{
        var all_record = await Attendance.find({}).exec();
    }catch (error) {
        const err = new HttpError(
            "Something went wrong while fetching data",
            500
        );
        return next(err);
    }

    if(all_record.length === 0){
        return res.json(return_dict);
    }else{
        for(let i = 0 ; i < all_record.length ; i++){
            let each_record = all_record[i];
            if(each_record.date.split("-")[0] === year){
                filter_data.push(each_record);
            }
        }
        for(let i = 0 ; i < filter_data.length ; i++){
            let each_obj = filter_data[i];
            let status = each_obj.status;
            let month_worked = each_obj.date.split("-")[1];
            let duration_worked = each_obj.work_duration;
            if(month_worked === "01"){
                return_dict["January"] += (duration_worked * pay_rate[status]); 
            }else if(month_worked === "02"){
                return_dict["February"] += (duration_worked * pay_rate[status]); 
            }else if(month_worked === "03"){
                return_dict["March"] += (duration_worked * pay_rate[status]); 
            }else if(month_worked === "04"){
                return_dict["April"] += (duration_worked * pay_rate[status]); 
            }else if(month_worked === "05"){
                return_dict["May"] += (duration_worked * pay_rate[status]); 
            }else if(month_worked === "06"){
                return_dict["June"] += (duration_worked * pay_rate[status]); 
            }else if(month_worked === "07"){
                return_dict["July"] += (duration_worked * pay_rate[status]); 
            }else if(month_worked === "08"){
                return_dict["August"] += (duration_worked * pay_rate[status]); 
            }else if(month_worked === "09"){
                return_dict["September"] += (duration_worked * pay_rate[status]); 
            }else if(month_worked === "10"){
                return_dict["October"] += (duration_worked * pay_rate[status]); 
            }else if(month_worked === "11"){
                return_dict["November"] += (duration_worked * pay_rate[status]); 
            }else if(month_worked === "12"){
                return_dict["December"] += (duration_worked * pay_rate[status]); 
            }
        }
        let key_list = Object.keys(return_dict);
        for(let i = 0 ; i < key_list.length - 1 ; i++){
            return_dict["Total"] += return_dict[key_list[i]];
        }
        return res.json(return_dict);
    }
};




module.exports = {
    addEmployee,
    getEmployeeByDate,
    deleteEmployee,
    updateEmployee,
    retrieveTotalAmount
}















