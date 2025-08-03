module.exports = {

  logResponse: (message, type) => {
    const logDirectory = path.join(__dirname, ".././log");
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory);
    }
    const currentDate = new Date().toISOString().split("T")[0];
    const logFilePath = path.join(logDirectory, `${currentDate}${type}.log`);
    const logMessage = `${new Date().toISOString()} - ${type.toUpperCase()}: ${
      typeof message === "object" ? JSON.stringify(message, null, 2) : message
    }\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error("Failed to write log:", err);
      }
    });
  },
};
