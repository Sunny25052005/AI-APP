const { Router } = require("express");
const { prisma } = require("../lib/prisma.js");
const { auth } = require("../middleware/auth.js");

function createEntityRouter(entity, fields) {
  const router = Router();

  // CREATE (Protected)
  router.post("/", auth, async (req, res) => {
    const data = req.body;

    const filtered = {};

    fields.forEach((f) => {
      filtered[f] = data[f] || null;
    });

    const saved = await prisma.data.create({
      data: {
        entity,
        content: JSON.stringify(filtered),
        userId: req.userId
      }
    });

    res.json(saved);
  });

  // GET (Protected)
  router.get("/", auth, async (req, res) => {
    const items = await prisma.data.findMany({
      where: {
        entity,
        userId: req.userId
      }
    });

    const parsed = items.map((i) => JSON.parse(i.content));

    res.json(parsed);
  });

  return router;
}

module.exports = createEntityRouter;
