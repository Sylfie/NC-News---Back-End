const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const mongoose = require('mongoose');
const { DB_URL } = require('./config/config');

mongoose.connect(DB_URL, { useNewUrlParser: true });
// app.set('view engine', 'ejs');

app.use(bodyParser.json());

// app.use(express.static('public'));

app.get("/", (req, res) => {
    res.send("home");
});

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
    res.status(404).send("Path not found");
});

app.use((err, req, res, next) => {
    console.log((err))
    if (err.code === '23502') res.status(400).send(err.message || 'Bad Server Request');
    if (err.code === undefined) res.status(400).send('Missing or Incorrect input fields');
    if (err.message === "No data returned from the query.") res.status(404).send("No matching item found");
    else next(err);
});

app.use((err, req, res, next) => {
    res.status(500).send("Internal server error");
});

module.exports = app;