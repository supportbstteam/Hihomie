const express = require("express");
const next = require("next");
const path = require("path");

// ⏰ Import Cron
const { startCronJobs } = require("./src/app/cron/jobs");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();


    // Start Cron Jobs
  startCronJobs();

  // Serve static files
  server.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

  // ✅ FIX: Use server.all() instead of server.get() for catch-all
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
