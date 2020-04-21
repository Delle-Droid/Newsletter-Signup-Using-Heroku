// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us4.api.mailchimp.com/3.0/lists/b0b8d50519";

  const options = {
    method: "POST",
    auth: "delle7:780b1d73ec4f9138575d3446dfd9e81e-us4"
  };

  const request = https.request(url, options, (response) => {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});

// 780b1d73ec4f9138575d3446dfd9e81e-us4

// b0b8d50519