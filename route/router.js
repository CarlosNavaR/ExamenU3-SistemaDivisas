/* jshint esversion: 6*/

//import modules
const express = require("express");
const path = require("path");
const axios = require('axios');

//router express object
const router = express.Router();


//routes modules export
module.exports = router;

// value of dollar
let value = 0;

router.get("/", (req, res) => {
    res.render("pages/index", {
        title: "Inicio"
    });
});

router.post('/turno', (req, res) => {
    getdata();
    let CompraUSD = (value - (value * 0.04)).toFixed(2);
    let ventaUSD = (Number(value) + Number(value * 0.04)).toFixed(2);
    res.render("pages/home", {
        title: "Home",
        Cajero: req.body.Nombre,
        CompraUSD,
        ventaUSD
    });
});

// Import API BMX to get value of dollar
function getdata() {
    axios.get('https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno?token=4750e19eb67f206c49ea47a58c173562fa10edac34a52b031200f552d2947a3c')
        .then(res => {
            for (const data of res.data.bmx.series) {
                value = data.datos[0].dato;
            }
        })
        .catch(error => {
            console.log(error);
        });
}