const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const dotenv = require("dotenv");
const {User_Route} = require("./src/routes/Users")
const {Event_Route } = require("./src/routes/Event")
const {Feedback_Route} = require("./src/routes/Feedback")


dotenv.config();

const app = express()


app.use(cors())
app.use(express.json())
app.use("/User", User_Route);
app.use("/Event", Event_Route);
app.use("/Feedback", Feedback_Route)


app.listen(8000, ()=>{
    mongoose.connect(process.env.MONGO_URl)
    console.log("server started at http://localhost:8000/")
})