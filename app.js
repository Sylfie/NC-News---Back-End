const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const mongoose = require('mongoose');
const { DB_URL } = process.env.NODE_ENV !== 'production' ? require('./config/config') : process.env;

mongoose.connect(DB_URL, { useNewUrlParser: true })
    .then(() => { console.log(`connected to ${DB_URL}`) })
// app.set('view engine', 'ejs');

app.use(bodyParser.json());

// app.use(express.static('public'));

app.get("/", (req, res) => {
    res.send("home");
});

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
    res.status(404).send({ message: "Path not found" });
});

app.use((err, req, res, next) => {
    if (err.status === 404) res.status(404).send({ message: err.message || 'Item not found' });
    if (err.status === 400) res.status(400).send({ message: err.message || 'Bad Server Request' });
    else next(err);
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: "Internal server error" });
});

module.exports = app;