import React, { useState } from 'react';
import {Bar} from "react-chartjs-2";
import {Chart as ChartJS} from "chart.js/auto";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const months = [
    "January" , 
    "February", 
    "March", 
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

const month_match = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
}





function Monthly(){
    
    let [year , setYear] = useState('');
    let handleChangeYear = (event) =>{
        let new_year = event.target.value;
        setYear(new_year);
        year = new_year;
        changeDataSet();
    };

    let [MonthlyData , setMonthlyData] = useState({
        labels: months,
        datasets: [{
            label: "Total Reservations",
            data: [],
            backgroundColor: ["#1976d2"]
        }]
    });
    const changeDataSet = async() =>{
        await fetch(
            `${process.env.REACT_APP_BACKEND_URL}user/getAllReservation`,
            {
                crossDomain: true,
                method: "POST",
                body: JSON.stringify({}),
                headers: { "Content-Type": "application/json" },
            }
        )
        .then((res) => res.json())
        .then((response) => {
            let filter_object = [];
            let set_array = [];
            let month_count = {
                "January": 0,
                "February": 0,
                "March": 0,
                "April": 0,
                "May": 0,
                "June": 0,
                "July": 0,
                "August": 0,
                "September": 0,
                "October": 0,
                "November": 0,
                "December": 0
            }
            console.log(year);
            for(let i = 0 ; i < response.length ; i++){
                let reservation_obj = response[i];
                let reservation_date = reservation_obj.date_of_visit;
                let status = reservation_obj.status;
                if(reservation_date.split("-")[0] === year.toString() && status !== 0){
                    filter_object.push(reservation_obj);
                }
            }
            filter_object.map(function(reservation_obj){
                let obj_month = reservation_obj.date_of_visit.split("-")[1];
                let month_convert = month_match[obj_month];
                month_count[month_convert] += 1;
            });
            for(let i = 0 ; i < months.length ; i++){
                let each_month = months[i];
                set_array.push(month_count[each_month]);
            }
            setMonthlyData({
                labels: months,
                datasets: [{
                    label: "Total Reservations in " + year,
                    data: set_array,
                    backgroundColor: ["#1976d2"]
                }]
            })
        })
        .catch((error) => {
            console.log("Error: " , error);
        });
    };

    return (
        <>
            <div style={{width: 1050}}>
            <Box sx={{ width: 100 }}>
            <FormControl sx={{minWidth: 140 }} size='small'>
                <InputLabel id="demo-simple-select-label">Select Year</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={year}
                label="Select Year"
                onChange={handleChangeYear}
                >
                <MenuItem value={2023}>2023</MenuItem>
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2025}>2025</MenuItem>
                </Select>
            </FormControl>
            </Box>
            <Bar data={MonthlyData}/>
            </div>
        </>
    )
}


export default Monthly;