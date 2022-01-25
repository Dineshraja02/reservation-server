const route = require('express').Router();
const service=require('../services/reservation.services');

route.post("/book",service.book);
route.post("/cancel",service.cancel);
route.get("/getbooked",service.bookedTickets);
route.get("/racticket",service.racTickets);
route.get("/waiting",service.waiting);
route.get("/child",service.below);
route.get("/availConfirm",service.availConfirm);
route.get("/availrac",service.availRac);
route.get("/availticket",service.availticket);

module.exports = route;