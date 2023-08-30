const express = require("express");
const route = express.Router();
const { getTabla, getResultado, getTotalPri, getGrafica } = require("../controllers/index")



route.get("/tabla", getTabla);
route.get("/resultado", getResultado);
route.get("/prioridad", getTotalPri);
route.get("/grafica", getGrafica);


module.exports = route;