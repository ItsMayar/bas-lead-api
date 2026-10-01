const express = require("express");
const leadsRouter = require("./routes/leads");

const app = express();

// Basic JSON body limit — avoids accepting unbounded request bodies.
app.use(express.json({ limit: "100kb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/leads", leadsRouter);

// Centralized error handler — avoids leaking stack traces to clients.
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`BAS Lead API listening on port ${PORT}`);
  });
}

module.exports = app;
