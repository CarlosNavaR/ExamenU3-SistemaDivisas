/* jshint esversion: 6*/

//import modules
const express = require("express");
const path = require("path");
const axios = require('axios');

//router express object
const router = express.Router();


//routes modules export
module.exports = router;

// Globbal variables
let datos;
let flag = 0;
let value = 0, ventaUSD = 0, CompraUSD = 0;

// To make report
let CajaInicialMXN = 0, CajaInicialUSD = 0;
let BalanceInicialUSD = 0, BalanceInicialMXN = 0;
let BalanceActualUSD = 0, BalanceActualMXN = 0;
let gananciaUSD = 0, ganancialMXN = 0;
let cajero = '';

// Date with node 
let dateTime = require('node-datetime');
let dt = dateTime.create();
let formatted = dt.format('Y-m-d');


router.get("/", (req, res) => {
  getdata();
  flag = 0;
  res.render("pages/index", {
    title: "Inicio"
  });
});

router.post("/", (req, res) => {
  getdata();
  flag = 0;
  res.render("pages/index", {
    title: "Inicio"
  });
});

router.post('/turno', (req, res) => {
  if (flag === 0) {
    datos = req.body;
    BalanceInicialUSD = req.body.usd;
    BalanceInicialMXN = req.body.mxn;
    CajaInicialMXN = BalanceInicialMXN;
    CajaInicialUSD = BalanceInicialUSD;
    cajero = req.body.Nombre;
    flag = 1;
  } else {
    BalanceInicialUSD = datos.usd;
    BalanceInicialMXN = datos.mxn;
    CajaInicialMXN = BalanceInicialMXN;
    CajaInicialUSD = BalanceInicialUSD;
    cajero = datos.Nombre;
  }
  CompraUSD = (value - (value * 0.04)).toFixed(2);
  ventaUSD = (Number(value) + Number(value * 0.04)).toFixed(2);
  res.render("pages/home", {
    title: "Inicio",
    Cajero: cajero,
    CompraUSD,
    ventaUSD,
    data : datos
  });
});

router.post('/compra', (req, res) => {
  res.render('pages/transacciones', {
    title: 'Compra',
    CompraUSD,
    name: 'compra',
    CompraUSD,
    ventaUSD
  })
});

router.post('/venta', (req, res) => {
  res.render('pages/transacciones', {
    title: 'Venta',
    name: 'venta',
    CompraUSD,
    ventaUSD
  })
});

router.post("/ticketC", (req, res) => {
  getdata();
  console.log(req.body)
  BalanceActualUSD = Number(req.body.CUSD) + Number(BalanceInicialUSD);
  BalanceActualMXN = Number(BalanceInicialMXN) - Number(req.body.CMXN);
  BalanceInicialUSD = BalanceActualUSD;
  BalanceInicialMXN = BalanceActualMXN;
  gananciaUSD = BalanceActualUSD - CajaInicialUSD;
  ganancialMXN = BalanceActualMXN - CajaInicialMXN;
  res.render("pages/ticket", {
    title: "Compra",
    fecha: formatted,
    nombre: datos.Nombre,
    Transaccion: 'Compra',
    usd: req.body.CMXN,
    etiqueta: 'MXN',
    mxn: req.body.CUSD,
    etiqueta2: 'USD'
  });
});

router.post("/ticketV", (req, res) => {
  getdata();
  console.log(req.body)
  BalanceActualUSD = Number(BalanceInicialUSD) - Number(req.body.VUSD) ;
  BalanceActualMXN = Number(req.body.VMXN) + Number(BalanceInicialMXN);
  BalanceInicialUSD = BalanceActualUSD;
  BalanceInicialMXN = BalanceActualMXN;

  console.log(BalanceActualUSD)
  console.log(BalanceActualMXN)
  
  gananciaUSD = BalanceActualUSD - CajaInicialUSD;
  ganancialMXN = BalanceActualMXN - CajaInicialMXN;

  res.render("pages/ticket", {
    title: "Venta",
    fecha: formatted,
    nombre: datos.Nombre,
    Transaccion: 'Venta',
    usd: req.body.VUSD,
    etiqueta: 'USD',
    mxn: req.body.VMXN,
    etiqueta2: 'MXN'
  });
});


router.post('/reporte', (req, res) => {
  res.render('pages/reporte', {
    title: 'reporte',
    CajaInicialUSD,
    CajaInicialMXN,
    BalanceActualUSD,
    BalanceActualMXN,
    gananciaUSD,
    ganancialMXN
  })
})

router.post('/home', (req, res) => {
  console.log(req.body)
  res.render("pages/home", {
    title: "Inicio",
    Cajero: cajero,
    CompraUSD,
    ventaUSD,
    data : datos
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