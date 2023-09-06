const express = require("express");
const route = express.Router();
const { getTabla, getResultado, getTotalPri, getGrafica, getGraficaPastel } = require("../controllers/index")



route.get("/tabla", getTabla);
route.get("/resultado", getResultado);
route.get("/prioridad", getTotalPri);
route.get("/grafica", getGrafica);
route.get("/pastel", getGraficaPastel);


module.exports = route;