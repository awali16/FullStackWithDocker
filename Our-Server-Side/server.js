require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const http = require("http");
const requestIp = require("request-ip");
const i18n = require("./src/i18n/i18n");
const indexRoute = require("./src/routes");

const port = process.env.PORT || 8080;


global.__basedir = `${__dirname}/`;

// create express application
const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static("public"));
app.set("view engine", "pug");
app.set("views", path.join(`${__dirname}/src`, "views"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(i18n);

app.set("trust proxy", true);
// Use middleware to get client IP
app.use(requestIp.mw());

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// cors setup
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use("/", indexRoute);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});