const express = require("express");
const authRoutes = require("./routes/auth.js");
const uploadRoutes = require("./routes/upload.js");
const entityRoutes = require("./routes/entity.js");

const app = express();
const PORT = process.env.PORT || 5000;

const config = {
  apiBaseUrl: "http://localhost:5000/api",
  entities: ["users", "products", "orders"], // Example entities
  uploadPath: "uploads/"
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/entity", entityRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Config endpoint
app.get("/api/config", (req, res) => {
  res.json(config);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
