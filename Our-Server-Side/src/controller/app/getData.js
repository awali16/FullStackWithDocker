// controllers/userController.js
const { PrismaClient } = require("@prisma/client");
const Response = require("../../services/Response");
const { sampleData, getFormattedTime, Gogje } = require("../../services/Constants");
const prisma = new PrismaClient(); // ✅ Instantiate once outside the handler

module.exports = {
  getData: async (req, res) => {
    try {
      const timestamp = Date.now();
      const timeStr = getFormattedTime();
      // 👤 Dummy user data
      const createdUser = await prisma.user.create({
        data: {
          firstName: `John ${timeStr}`,
          lastName: "Doe",
          address: "123 Demo St",
          dob: new Date("1998-05-04"),
          email: `john.doe+${timestamp}@example.com`,
          mobile: `+100000${timestamp.toString().slice(-6)}`,
          password: "hashedpassword123", // ❗ should be hashed in production
        },
      });

      console.log("✅ Dummy user inserted:", createdUser);

      return Response.successResponseWithData(
        res,
        sampleData,
        "Data retrieved successfully",
        200
      );
    } catch (err) {
      console.error("❌ Error in getData:", err);
      return Response.errorResponseData(res, "Something went wrong", 500);
    }
  },
  crashServer: async(req, res) => {
    
    try {
      // // Intentionally crash the server
       process.exit(1);
    
    } catch (error) {
      console.error("❌ Server intentionally crashed", err);
      return Response.errorResponseData(res, "Something went wrong", 500);
    }
  },
};
