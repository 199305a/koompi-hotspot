const express = require("express");

const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// For auto checking
const cron = require("node-cron");
const autoCheck = require("./routes/hotspot_plan/auto/autoCheck");
const autoTopUp = require("./routes/hotspot_plan/auto/autoTopup");

// AWS sending email middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// to access profile
app.use(express.static("./"));

/// midlleware

app.use(express.json()); // allow us for req.body
app.use(cors());

/// ROUTES ///

//register and login routes
app.use("/api/auth", require("./routes/Account/jwtAuth"));
app.use("/api/auth", require("./routes/Account/completeInfo"));

//dashboard route
app.use("/api/dashboard", require("./routes/Account/dashboard"));

// Hotspot Plan
app.use("/api/hotspot", require("./routes/hotspot_plan/hotspot_plan"));
app.use("/api/hotspot", require("./routes/hotspot_plan/renewPlan"));

//  change password
app.use(
  "/api/change-password",
  require("./routes/Account/change_password_Acc")
);
// app.use(
//   "/api/change-password",
//   require("./routes/hotspot_plan/change_password_User")
// );

//  forgot and reset password
app.use("/api", require("./routes/Account/forgot_reset_pass"));

// upload avata
app.use("/api", require("./routes/Account/uploadProfile"));

// integration with selendra wallet
app.use("/api/selendra", require("./routes/intergrate_Selendra/getwallet"));

// send sms to testing
app.use("/api/test", require("./routes/Account/twilioSMS/lookup"));

app.listen(5000, () => {
  console.log("server is running on port 5000...");

  // Check deadline at 11:59 PM every day.
  // cron.schedule("59 23 * * *", () => {
  //   autoCheck.statusPlan();
  //   console.log("checking automatically plan every day");
  // });
  cron.schedule("* * * * *", () => {
    autoCheck.statusPlan();
    console.log("checking automatically plan every a minute");
  });

  // Check  every minute for automatically to up.
  cron.schedule("* * * * *", () => {
    autoTopUp.autoRenew();
    console.log("automatically topup every minute");
  });
});
