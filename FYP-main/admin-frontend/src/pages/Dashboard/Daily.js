import React, { useState } from 'react';
import {Line , Pie} from "react-chartjs-2";
import {Chart as ChartJS} from "chart.js/auto";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Divider, Typography } from '@mui/material';



const match_day = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
]


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

function Daily(){
    

    let [year , setYear] = useState('');
    let handleChangeYear = (event) =>{
        let new_year = event.target.value;
        setYear(new_year);
        year = new_year;
        changeDataSet();
    };

    let[month , setMonth] = useState('');
    let handleChangeMonth = (event)=>{
        let new_month = event.target.value;
        setMonth(new_month);
        month = new_month;
        changeDataSet();
    }


    let [DailyLineData , setDailyLineData] = useState({
        labels: days,
        datasets: [{
            label: "Total Reservations on Each Day for (Please select Month and Year)",
            data: []
        }]
    });

    let [DailyPieData , setDailyPieData] = useState({
        labels: [],
        datasets: [{
            label: 'No Data (Please select a year)',
            data: [1],
            backgroundColor: [
                'black'
            ],
        }]
    });
 
    
    const changeDataSet = async() =>{
        if(year === '' || month === ''){
            setDailyLineData({
                labels: days,
                datasets: [{
                    label: "Total Valid Reservations",
                    data: []
                }]
            })
        }else{
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
                let filter_object_Line = [];
                let filter_object_Pie = [];
                let set_array_Line = [];
                let set_array_Pie = [];
                let day_count_Line = {
                    "Monday": 0,
                    "Tuesday":0,
                    "Wednesday": 0,
                    "Thursday": 0,
                    "Friday": 0,
                    "Saturday": 0,
                    "Sunday": 0
                }
                let day_count_Pie = {
                    "Monday": 0,
                    "Tuesday":0,
                    "Wednesday": 0,
                    "Thursday": 0,
                    "Friday": 0,
                    "Saturday": 0,
                    "Sunday": 0
                }
                for(let i = 0 ; i < response.length ; i++){
                    let reservation_obj = response[i];
                    let year_compare = reservation_obj.date_of_visit.split("-")[0];
                    let month_compare = reservation_obj.date_of_visit.split("-")[1];
                    let status = reservation_obj.status;
                    if(year_compare === year.toString() && month_compare === month && status !== 0){
                        filter_object_Line.push(reservation_obj);
                    }
                }
                for(let i = 0 ; i < response.length ; i++){
                    let reservation_obj = response[i];
                    let year_compare = reservation_obj.date_of_visit.split("-")[0];
                    let status = reservation_obj.status;
                    if(year_compare === year.toString() && status !== 0){
                        filter_object_Pie.push(reservation_obj);
                    }
                }
                if(filter_object_Line.length !== 0){
                    for(let i = 0 ; i < filter_object_Line.length ; i++){
                        let reservation_obj = filter_object_Line[i];
                        let date_visited = reservation_obj.date_of_visit;
                        let dt = new Date(date_visited);
                        let day_index = dt.getDay();
                        let day = match_day[day_index];
                        day_count_Line[day] += 1;
                    }
                }
                if(filter_object_Pie.length !== 0){
                    for(let i = 0 ; i < filter_object_Pie.length ; i++){
                        let reservation_obj = filter_object_Pie[i];
                        let date_visited = reservation_obj.date_of_visit;
                        let dt = new Date(date_visited);
                        let day_index = dt.getDay();
                        let day = match_day[day_index];
                        day_count_Pie[day] += 1;
                    }
                }
                for(let i = 0 ; i < days.length ; i++){
                    let each_day = days[i];
                    set_array_Line.push(day_count_Line[each_day]);
                    set_array_Pie.push(day_count_Pie[each_day]);
                }
                setDailyLineData({
                    labels: days,
                    datasets: [{
                        label: "Total Reservations on Each Day for " + month_match[month] + " " + year,
                        data: set_array_Line
                    }]
                })
                let sum = 0;
                set_array_Pie.map(function(num){
                    sum += num;
                });
                if(sum === 0){
                    setDailyPieData({
                        labels: [],
                        datasets: [{
                            label: 'No Data for selected year (' + year + ')',
                            data: [1],
                            backgroundColor: [
                                'black'
                            ],
                        }]
                    });
                }else{
                    setDailyPieData({
                        labels: days,
                        datasets: [{
                            label: 'Total Reservations for Each Day in ' + year,
                            data: set_array_Pie,
                            backgroundColor: [
                                'red',
                                '#yellow',
                                'pink',
                                'green',
                                'orange',
                                'blue',
                                'purple'
                            ],
                        }]
                    })
                }
            })
            .catch((error) => {
                console.log("Error: " , error);
            });
        }
    };

    return (
        <>
            <div style={{width: 1050}}>
            <Box sx={{ width: 500 }}>
                <FormControl sx={{minWidth: 140 }} size='small'>
                    <InputLabel id="demo-simple-select-label">Select Month</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={month}
                    label="Select Month"
                    onChange={handleChangeMonth}
                    >
                    <MenuItem value={"01"}>January</MenuItem>
                    <MenuItem value={"02"}>February</MenuItem>
                    <MenuItem value={"03"}>March</MenuItem>
                    <MenuItem value={"04"}>April</MenuItem>
                    <MenuItem value={"05"}>May</MenuItem>
                    <MenuItem value={"06"}>June</MenuItem>
                    <MenuItem value={"07"}>July</MenuItem>
                    <MenuItem value={"08"}>August</MenuItem>
                    <MenuItem value={"09"}>September</MenuItem>
                    <MenuItem value={"10"}>October</MenuItem>
                    <MenuItem value={"11"}>November</MenuItem>
                    <MenuItem value={"12"}>December</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{minWidth: 140 , marginLeft: "40px" }} size='small'>
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
            <Line data={DailyLineData}/>
            <Divider sx={{marginTop: "80px" , marginBottom: "80px"}}/>
            <Box sx={{display:"flex" , alignItems: "center" , justifyContent: "center" , width: "100%" }} style = {{height: 600}}>
                <Pie data = {DailyPieData}/>
            </Box>
            </div>
        </>
    )
}

export default Daily;