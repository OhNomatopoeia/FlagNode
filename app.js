const express = require('express')
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

//mongoose.Promise = global.Promise;

const app = express()
const port = 3000


// Bodyparser
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())


// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.get('/', (req, res) => res.send("Welcome to setting up Node.js project tutorial!"))

// Requiring routes. Might be worth moving it into a centralized file if we get too many routes
require("./app/routes/visit.routes")(app)

app.listen(port, () => {
    console.log("listening")
});