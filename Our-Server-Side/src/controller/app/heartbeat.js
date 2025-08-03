const Response = require("../../services/Response");

module.exports = {
  heartBeat: (req, res) => {
    const data = {
      status: "success",
      message: "Server is running",
      timestamp: new Date().toISOString(),
    };
    return Response.successResponseWithData(
      res,
      data,
      "Server is running and Alive",
      200
    );
  },
};
