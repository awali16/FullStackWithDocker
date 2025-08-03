const jwt = require("jsonwebtoken");

// Generates an uploads token
module.exports.issueUser = function (payload) {
  return jwt.sign(
    {
      role: payload.role,
      id: payload.id,
    },
    process.env.JWT_USER_SECRETKEY,
    { algorithm: "HS512",
      expiresIn: process.env.USER_TOKEN_EXPIRES_IN
     }
  );
};


// Verifies uploads token
module.exports.verify = function (token, callback) {
  try {
    return jwt.verify(token, process.env.JWT_USER_SECRETKEY, { algorithms: ['HS512'] }, callback);
  } catch (err) {
    return "error";
  }
};

// Decode token on a request and get without bearer
module.exports.decode = async (token) => {
  const parts = token.split(" ");
  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
    return false;
  }
  return false;
};