const express = require("express");
const { prisma } = require("../lib/prisma.js");
const { auth } = require("../middleware/auth.js");
const { createEntityRouter } = require("../routers/entity.js");

const router = express.Router();

// Create dynamic routes for each entity type
router.use("/users", createEntityRouter("users", ["name", "description", "value"]));
router.use("/products", createEntityRouter("products", ["name", "description", "value"]));
router.use("/orders", createEntityRouter("orders", ["name", "description", "value"]));

module.exports = router;
