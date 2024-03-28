let two_pax = [];
let two_pax_temp = [];

let four_pax =[];
let four_pax_temp = [];

const fs = require("fs");

const filePath = require("path").resolve(__dirname , "./Tables.csv");

var data = fs.readFileSync(filePath , "utf-8")
    .toString()
    .split("\n")
    .map(e => e.trim())
    .map(e => e.split(",").map(e => e.trim()));

two_pax_temp = data[0];
four_pax_temp = data[1];

for(let i = 1 ; i < two_pax_temp.length ; i++){
    two_pax.push(parseInt(two_pax_temp[i]));
}

for(let i = 1 ; i < four_pax_temp.length ; i++){
    four_pax.push(parseInt(four_pax_temp[i]));
}

const two_pax_table = two_pax;
const four_pax_table = four_pax;



module.exports = {two_pax_table, four_pax_table};