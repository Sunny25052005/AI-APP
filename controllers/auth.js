const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { prisma } = require("../lib/prisma.js");

const SECRET = "secret123";

async function signup(req, res) {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed }
  });

  res.json(user);
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ userId: user.id }, SECRET);

  res.json({ token });
}

module.exports = { signup, login };
