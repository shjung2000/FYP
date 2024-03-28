const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const schedule = require("node-schedule");
const app = express();
const adminInterfaceLink = process.env.ADMIN_INTERFACE;
const { sendDayBeforeReminder } = require("./HelperFunctions/EmailFunctions");
// ==================configure app settings==================
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin , X-Requested-With , Content-Type , Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET , POST , PATCH , DELETE");
  next();
});

const ReservationRoute = require("./Routes/ReservationRoutes");
const UserRoute = require("./Routes/UserRoutes");
const AttendanceRoute = require("./Routes/AttendanceRoutes");
const User = require("./Models/UserModel");

// ==================use routes==================
app.use("/api/reservation", ReservationRoute);
app.use("/api/user", UserRoute);
app.use("/api/employee", AttendanceRoute);
app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

app.get("/", (req, res) => {
  res.send("OK");
});
app.get("/api", (req, res) => {
  res.send("Hello");
});

// ==================initialise==================
mongoose
  .set("strictQuery", false)
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(8000);
    console.log("Connected Successfully");
  })
  .catch((error) => {
    console.log(error);
  });

const cron = require("node-cron");
const { spawn } = require("child_process");

// Schedule the restart script to run every day at 1:00 AM
cron.schedule("0 0 * * *", () => {
  console.log("Restarting Node.js application...");
  const restart = spawn("node", ["restart.js"]);

  // Log any error or exit event from the restart script
  restart.on("error", (err) => {
    console.error(err);
  });

  restart.on("exit", (code) => {
    console.log(`Node.js application restarted with exit code ${code}`);
  });
});
// this one just check every 12am
schedule.scheduleJob(
  //for demo
  //"*/30 * * * * *",

  // for production
  "* 0 * * * ",

  async () => {
    const currDate = new Date();
    currDate.setDate(currDate.getDate() + 1);
    const year = currDate.getUTCFullYear().toString();

    var month = (currDate.getMonth() + 1).toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    if (month == "13") {
      month = "01";
    }

    var day = currDate.getDate().toString();
    if (day.length == 1) {
      day = "0" + day;
    }
    const formattedDate = year + "-" + month + "-" + day;

    console.log(formattedDate);
    await User.find({ date_of_visit: formattedDate, status: 1 }).then((res) => {
      var alertUserPromises = [];
      for (let i = 0; i < res.length; i++) {
        const reservation = res[i];
        const alertPromise = sendDayBeforeReminder(
          reservation,
          adminInterfaceLink + "/reservation/view/" + reservation._id,
          adminInterfaceLink + "/reservation/cancel/" + reservation._id
        );
        alertUserPromises.push(alertPromise);
      }

      Promise.allSettled(alertUserPromises).then(() => {
        console.log("Reminded");
      });
    });
  }
);
