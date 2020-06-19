// dotenv
require("dotenv").config();

//required
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

//routes
const users = require("./routes/users");

// instantiate Express
const app = express();


// use the imports
app.use(bodyParser.json());
app.use(cors());

// use routes
app.use("/users/", users);

mongoose
    .connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to the Database"))
    .catch(err => console.log("DB ERROR : " + err));

// const port = process.env.PORT || 3000;

// Server

app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Server running at http://${process.env.HOST}:${process.env.PORT}/`);
});
// app.listen(port, () => console.log("Server has Started"));