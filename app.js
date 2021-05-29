const ejsLayouts = require('express-ejs-layouts');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// Public resources
app.use(express.static('public'));

// Use body parser
app.use(express.urlencoded({
    extended: true
}));

// View motor EJS
app.set("view engine", "ejs");
app.use(ejsLayouts);

// Route module load
const router = require("./route/router");

// Route module use
app.use("/", router);

app.listen(port, () => {
    console.log("Server on: port 8080");
});