const cron = require("node-cron");

function startCronJobs() {
  cron.schedule("0 * * * *", async () => {
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

