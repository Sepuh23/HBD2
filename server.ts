import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import multer from "multer";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Optimization: Add request logging to monitor traffic
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const DB_FILE = path.join(process.cwd(), "db.json");
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Serve uploaded files statically at /uploads URL path
app.use("/uploads", express.static(UPLOAD_DIR));

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({}));
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Database API routes
app.get("/api/data", (req, res) => {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.post("/api/data", (req, res) => {
  try {
    const existingDataStr = fs.readFileSync(DB_FILE, "utf-8");
    const existingData = JSON.parse(existingDataStr);
    
    const newData = { ...existingData, ...req.body };
    fs.writeFileSync(DB_FILE, JSON.stringify(newData, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to write database" });
  }
});

app.post("/api/data/reset", (req, res) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify({}));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset database" });
  }
});

// File upload route
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  // Return the web path to the newly uploaded file
  const filePath = "/uploads/" + req.file.filename;
  res.json({ url: filePath });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
