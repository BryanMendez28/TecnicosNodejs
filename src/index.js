require("dotenv").config();
const express  = require ("express");
const mysql = require("mysql2");
const conn = require("express-myconnection");
const cors = require("cors");
const route = require("./routes/index")


const app = express()
const PORT = process.env.PORT || 5001;
const dbConfig = {
    host: process.env.DB_HOST || "masven.com.mx",
    port: process.env.DB_PORT || "3306",
    user: process.env.DB_USER || "development",
    password: process.env.DB_PASSWORD || "Daniel%2020",
    database: process.env.DB_NAME || "cliente32",
}

app.use(cors()); // Configura las políticas de acceso CORS

app.use(conn(mysql, dbConfig, "single"));
app.use(express.json())
app.use("/",route);
app.listen(PORT, () => {
    console.log(`server runing on port ${PORT}`)
})

