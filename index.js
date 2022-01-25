require("dotenv").config();
const express = require('express');
const app =express();
const cors= require('cors');
const mongo = require('./mongo');
const reservationRoute = require("./routes/reservation")
const authRoute = require("./routes/auth");


        mongo.connect();   

        app.use(express.json());

        app.use(cors());

        app.use('/user',authRoute);
        
        app.use('/reservation', reservationRoute);

        const port =process.env.PORT||3001;
        app.listen(port,()=>{
        console.log("Server running in port 3001")
        })
