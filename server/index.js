const express = require("express");
const path = require("path");

const PORT = 8080;

const app = express();
app.use(express.json());

// Serve React build (dist folder ของ Vite)
app.use(express.static(path.join(__dirname, "../client/dist")));

// Handle react-router-dom routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
