const express = require("express");
const route = express.Router();
const { getTabla, getResultado, getTotalPri} = require("../controllers/index")



route.get("/tabla", getTabla);
route.get("/resultado", getResultado);
route.get("/prioridad", getTotalPri);


module.exports = route;