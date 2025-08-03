module.exports = {
    /**
     * @description This function use for format success response of rest api
     * @param data
     * @param code
     * @param message
     * @param res
     * @param extras
     * @returns {{data: *, meta: {message: *, code: *}}}
     */

    successResponseData(res, data, code = 1, message, extras) {
        const response = {
            data,
            meta: {
                code,
                message
            }
        };
        if (extras) {
            Object.keys(extras).forEach((key) => {
                if ({}.hasOwnProperty.call(extras, key)) {
                    response.meta[key] = extras[key];
                }
            });
        }
        return res.send(response);
    },
    successResponseWithData(res, data, message, statusCode){
        return res.status(statusCode).json({
          success: true,
          message,
          data,
        });
      },
    successResponseWithoutData(res, message, code = 1) {
        const response = {
            meta: {
                code,
                message
            }
        };
        return res.send(response);
    },

    errorResponseWithoutData(res, message, code = 0) {
        const response = {
            data: null,
            meta: {
                code,
                message
            }
        };
        return res.send(response);
    },

    errorResponseData(res, message, code = 400) {
        const response = {
            code,
            message
        };
        return res.status(200)
            .send(response);
    },

    validationErrorResponseData(res, message, code = 400) {
        const response = {
            code,
            message
        };
        return res.status(200)
            .send(response);
    }
};
