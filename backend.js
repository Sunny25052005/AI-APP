const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient();
const SECRET = "secret123";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token" });
  
  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Config
const config = {
  apiBaseUrl: "http://localhost:5000/api",
  entities: ["users", "products", "orders"],
  uploadPath: "uploads/"
};

// Routes
// Auth routes
app.post("/api/auth/signup", async (req, res) => {
  console.log("Signup request received:", req.body);
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    console.log("Hashing password...");
    const hashed = await bcrypt.hash(password, 10);
    console.log("Password hashed, creating user...");
    
    const user = await prisma.user.create({
      data: { email, password: hashed }
    });
    console.log("User created successfully:", user);
    res.json(user);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) return res.status(400).json({ error: "User not found" });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });
    
    const token = jwt.sign({ userId: user.id }, SECRET);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Entity routes
const upload = multer({ dest: "uploads/" });

app.post("/api/upload/:entity", auth, upload.single("file"), async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/entity/:entity", auth, async (req, res) => {
  try {
    const entity = req.params.entity;
    const data = req.body;
    
    const filtered = {};
    ["name", "description", "value"].forEach((f) => {
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
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/entity/:entity", auth, async (req, res) => {
  try {
    const entity = req.params.entity;
    const items = await prisma.data.findMany({
      where: {
        entity,
        userId: req.userId
      }
    });

    const parsed = items.map((i) => JSON.parse(i.content));
    res.json(parsed);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Config endpoint
app.get("/api/config", (req, res) => {
  res.json(config);
});

// App generation endpoint
app.post("/api/apps/generate", auth, async (req, res) => {
  try {
    const { name, description, category, features, techStack, deployment } = req.body;
    
    // Create app record in database
    const app = await prisma.data.create({
      data: {
        entity: "ai_app",
        content: JSON.stringify({
          name,
          description,
          category,
          features,
          techStack,
          deployment,
          status: "generating",
          createdAt: new Date().toISOString()
        }),
        userId: req.userId
      }
    });

    // Simulate AI generation process
    setTimeout(() => {
      console.log(`AI App "${name}" generated successfully for user ${req.userId}`);
    }, 3000);

    res.json({
      id: app.id,
      message: "App generation started successfully",
      status: "generating"
    });
  } catch (error) {
    console.error("App generation error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get user's apps
app.get("/api/apps", auth, async (req, res) => {
  try {
    const apps = await prisma.data.findMany({
      where: {
        entity: "ai_app",
        userId: req.userId
      }
    });

    const parsedApps = apps.map(app => ({
      id: app.id,
      ...JSON.parse(app.content)
    }));

    res.json(parsedApps);
  } catch (error) {
    console.error("Get apps error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
