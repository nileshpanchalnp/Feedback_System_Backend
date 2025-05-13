const express = require("express");
const { createFeedback,getFeedbackForUSER ,deleteFeedback,updateFeedback} = require('../controlls/Feedback');
const   authMiddleware = require("../middlewares/AuthToken");

const Feedback_Route = express.Router();

Feedback_Route.post("/fbcreate", authMiddleware, createFeedback);
Feedback_Route.get("/fbget/:userId", getFeedbackForUSER);
Feedback_Route.delete('/fbdelete/:id', authMiddleware, deleteFeedback)
Feedback_Route.put('/fbupdate/:id', authMiddleware, updateFeedback)


module.exports = {Feedback_Route};


