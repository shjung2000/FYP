const fs = require("fs");

const filePath = require("path").resolve(__dirname , "./Operating Hour.csv");

var data = fs.readFileSync(filePath , "utf-8")
    .toString()
    .split("\n")
    .map(e => e.trim())
    .map(e => e.split(",").map(e => e.trim()));


let starting_hour = data[0][1];
let ending_hour = data[1][1];

if(starting_hour.length === 3){
    starting_hour = "0" + starting_hour;
}

module.exports = {starting_hour , ending_hour};
