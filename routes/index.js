const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const users = require("./users");
const LocalStrategy = require('passport-local').Strategy;

const { ensureAuthenticated } = require("../config/auth")
router.get("/", (req, res) =>

    res.render("welcome", {
        login: req.isAuthenticated(),

    }))

router.get("/", ensureAuthenticated, (req, res) =>

    res.render("welcome", {
        login: req.isAuthenticated(),
        name: req.user.name
    }))
module.exports = router;