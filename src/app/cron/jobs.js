const cron = require("node-cron");

function startCronJobs() {
  // Runs every day at 1:45 PM
  cron.schedule("30 13 * * *", async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cron-send-mail");
      const data = await res.json();

      console.log("API Response:", data);
    } catch (error) {
      console.log("❌ API Error:", error);
    }
  });
}

module.exports = { startCronJobs };

