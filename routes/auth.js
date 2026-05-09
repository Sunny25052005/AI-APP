const express = require("express");
const { login, signup } = require("../controllers/auth.js");
const { prisma } = require("../lib/prisma.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
