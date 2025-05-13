const express = require("express");
const {  createEvent, getEvents}  = require("../controlls/Event");


const Event_Route = express.Router();

Event_Route.post("/createEvent", createEvent);
Event_Route.get("/getEvent", getEvents);

module.exports = {Event_Route };