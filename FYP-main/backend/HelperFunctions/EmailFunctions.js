const nodemailer = require("nodemailer");
const path = require("path");
var handlebars = require("handlebars");

var fs = require("fs");
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.TRANSPORTER_AUTH_USER,
        pass: process.env.TRANSPORTER_AUTH_PASSWORD,
    },
});

// email scenarios: (can refactor later)
// confirmaion

const changeTimeFormat = (time) => {
    let hour = time.slice(0, 2);
    let minute = time.slice(2);

    if (hour === "13") {
        hour = "1:";
    } else if (hour === "14") {
        hour = "2:";
    } else if (hour === "15") {
        hour = "3:";
    } else if (hour === "16") {
        hour = "4:";
    } else if (hour === "17") {
        hour = "5:";
    } else if (hour === "18") {
        hour = "6:";
    } else if (hour === "19") {
        hour = "7:";
    } else if (hour === "20") {
        hour = "8:";
    } else if (hour === "21") {
        hour = "9:";
    } else if (hour === "22") {
        hour = "10:";
    } else {
        hour = "12:";
    }

    let newString = hour + minute + "PM";
    return newString;
};

const sendDayBeforeReminder = async (
    reservationDetails,
    viewReservationLink,
    cancellationLink
) => {
    var confirmationHtmlTemplate = fs.readFileSync(
        path.resolve(__dirname, "../EmailTemplates/ReminderEmail.html"),
        { encoding: "utf-8" }
    );
    var template = handlebars.compile(confirmationHtmlTemplate);
    const {
        email: recipient,
        name,
        phone,
        time,
        pax,
        date_of_visit,
        _id: reservation_id,
    } = reservationDetails;

    let new_timing = changeTimeFormat(time);

    var replacements = {
        recipient,
        name,
        phone,
        new_timing,
        pax,
        date_of_visit,
        reservation_id,
        cancellationLink,
        viewReservationLink,
    };

    var htmlToSend = template(replacements);
    emailSubject = "Reservation Reminder";

    await transporter.sendMail({
        from: `"Honey Night" ${process.env.TRANSPORTER_AUTH_USER}`, // sender address
        to: recipient, // list of receivers
        subject: emailSubject, // Subject line
        html: htmlToSend, // html body
        attachments: [
            {
                filename: "logo.png",
                path: path.resolve(__dirname, "../EmailTemplates/logo.png"),
                cid: "honeyNightLogo", //same cid value as in the html img src
            },
        ],
    });
};

const sendConfirmation = async (
    reservationDetails,
    viewReservationLink,
    cancellationLink
) => {
    var confirmationHtmlTemplate = fs.readFileSync(
        path.resolve(__dirname, "../EmailTemplates/ConfirmationEmail.html"),
        { encoding: "utf-8" }
    );
    var template = handlebars.compile(confirmationHtmlTemplate);
    const {
        email: recipient,
        name,
        phone,
        time,
        pax,
        date_of_visit,
        _id: reservation_id,
    } = reservationDetails;

    let new_timing = changeTimeFormat(time);

    var replacements = {
        recipient,
        name,
        phone,
        new_timing,
        pax,
        date_of_visit,
        reservation_id,
        cancellationLink,
        viewReservationLink,
    };

    var htmlToSend = template(replacements);
    emailSubject = "Reservation Confirmation";

    await transporter.sendMail({
        from: `"Honey Night" ${process.env.TRANSPORTER_AUTH_USER}`, // sender address
        to: recipient, // list of receivers
        subject: emailSubject, // Subject line
        html: htmlToSend, // html body
        attachments: [
            {
                filename: "logo.png",
                path: path.resolve(__dirname, "../EmailTemplates/logo.png"),
                cid: "honeyNightLogo", //same cid value as in the html img src
            },
        ],
    });
};

module.exports = { sendConfirmation, sendDayBeforeReminder };
