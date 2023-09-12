const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const filename = uuidv4() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({
        error:
          "File upload failed. Please make sure to select a file to upload.",
      });
  }

  const originalName = req.file.originalname;
  const fileUrl = `http://localhost:${port}/${req.file.filename}`;

  res.json({ originalName, fileUrl });
});

app.get("/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "uploads", filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      res
        .status(404)
        .json({ error: "File not found. The requested file does not exist." });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
