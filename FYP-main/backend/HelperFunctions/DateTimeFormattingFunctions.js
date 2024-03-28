const changeSingleDigit = (number) => {
    if (number < 10) {
        return "0" + number;
    }
    return number;
};

const convertToDateTimeFormat = (dateTimeObject) => {
    console.log("dateTimeObject",dateTimeObject)
    const year = dateTimeObject.getFullYear();
    const month = changeSingleDigit(dateTimeObject.getMonth() + 1);
    const day = changeSingleDigit(dateTimeObject.getDate());
    const hour = changeSingleDigit(dateTimeObject.getHours());

    const minutes = changeSingleDigit(dateTimeObject.getMinutes());
    return [year, month, day].join("-") + " " + hour + minutes;
};

const convertToDateTimeObject = (dateTimeFormattedString) => {
    const [dateString, timeString] = dateTimeFormattedString.split(" ");
    // const dateString = splitString[0]
    const [year, month, day] = dateString.split("-");

    // const timeString = splitString[1]
    const hours = timeString.substring(0, 2);
    const minutes = timeString.substring(2);

    const returnDateInMs =
        new Date(year, month - 1, day, hours, minutes) + 8 * 60 * 60 * 1000;
    console.log(year, month - 1, day, hours, minutes, 0, 0);
    return new Date(new Date(returnDateInMs));
};



module.exports = { convertToDateTimeFormat, convertToDateTimeObject };
