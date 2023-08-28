const express = require("express");
const route = express.Router();
const {get, getTabla, getResultado} = require("../controllers/index")



route.get("/tabla", getTabla);
route.get("/resultado", getResultado);


module.exports = route;