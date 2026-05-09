const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const { prisma } = require("../lib/prisma.js");
const { auth } = require("../middleware/auth.js");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/:entity", auth, upload.single("file"), async (req, res) => {
  const results = [];
  const entity = req.params.entity;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      for (const row of results) {
        await prisma.data.create({
          data: {
            entity,
            content: JSON.stringify(row),
            userId: req.userId
          }
        });
      }

      res.json({ message: "CSV imported", count: results.length });
    });
});

module.exports = router;
