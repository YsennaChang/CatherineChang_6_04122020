const express = require ("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const rateLimit = require("express-rate-limit"); //Basic rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints such as password reset.

const createAccountLimiter = rateLimit({
    windowMs : 60 * 60 * 1000, // 1 hour
    max : 5, // blocking after 5  requests
    message : "Too many accounts created from this IP, please try again after an hour"
})

const tryLoginLimiter= rateLimit({
    windoMs: 15 * 60 * 1000, // 15 minutes
    max : 3, // start blocking after 3 requests
    message : "Too many try, retry in a few minutes"
});


router.post("/signup", createAccountLimiter, userCtrl.signup);
router.post("/login", tryLoginLimiter,  userCtrl.login)

module.exports = router;