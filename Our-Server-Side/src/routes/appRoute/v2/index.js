const router = require("express").Router();
const {getData, crashServer} = require("../../../controller/app/getData.js");

router.use("/get-data", getData);
router.use("/crash-the-server", crashServer)

module.exports = router;