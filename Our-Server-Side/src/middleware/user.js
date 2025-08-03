const Response = require("../services/Response.js");
const jwToken = require("../services/Token.js");
const { User } = require("../models");
const { INACTIVE, ACTIVE } = require("../services/Constants.js");
const Constants = require("../services/Constants.js");

module.exports = {
  /**
   * @description "This function is used to authenticate and authorize a user."
   * @param req
   * @param res
   */
  userTokenAuth: async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        Response.errorResponseWithoutData(
          res,
          res.locals.__("authorizationError"),
          401
        );
      } else {
        const tokenData = await jwToken.decode(token);
        if (tokenData) {
          const decoded = jwToken.verify(tokenData);

          if (decoded.id) {
            req.authUserId = decoded.id;
            req.role = decoded.role;

            // eslint-disable-next-line consistent-return
            const user = await User.findOne(
              { _id: req.authUserId },
              { status: 1, token: 1 }
            );

            let user_token = `Bearer ${user.token}`;
            if (user && user_token === token) {
              // let user_token = `Bearer ${user.token}`;
              // const userTokenData = await jwToken.decode(user_token);
              // if (userTokenData) {
              // const decodedUserData = await jwToken.verify(userTokenData);
              // if (decodedUserData.id) {
              //   if (decodedUserData.id === decoded.id) {
              if (user && user.status === INACTIVE) {
                return Response.errorResponseWithoutData(
                  res,
                  res.locals.__("accountIsInactive"),
                  401
                );
              }
              if (user && user.status === ACTIVE) {
                return next();
              } else {
                return Response.errorResponseWithoutData(
                  res,
                  res.locals.__("accountBlocked"),
                  401
                );
              }
              // } else {
              //   return Response.errorResponseWithoutData(
              //     res,
              //     res.locals.__("invalidToken"),
              //     401
              //   );
              // }
            } else {
              return Response.errorResponseWithoutData(
                res,
                res.locals.__("invalidToken"),
                401
              );
            }
            // } else {
            //   return Response.errorResponseWithoutData(
            //     res,
            //     res.locals.__("invalidToken"),
            //     401
            //   );
            // }
          } else {
            return Response.errorResponseWithoutData(
              res,
              res.locals.__("invalidToken"),
              401
            );
          }
        } else {
          return Response.errorResponseWithoutData(
            res,
            res.locals.__("invalidToken"),
            401
          );
        }
      }
    } catch (error) {
      return Response.errorResponseData(
        res,
        res.__("internalError"),
        Constants.INTERNAL_SERVER
      );
    }
  },
};