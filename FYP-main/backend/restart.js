const pm2 = require("pm2");

// Connect to PM2
pm2.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  // Restart the Node.js application
  pm2.restart("backend", (err) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    console.log("Node.js application restarted successfully");
    pm2.disconnect();
  });
});
