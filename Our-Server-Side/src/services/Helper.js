module.exports = {
  /**
   * @description This function use for create validation unique key.
   * @param apiTag
   * @param error
   * @return {*}
   */
  validationMessageKey: (apiTag, error) => {
    let key = module.exports.toUpperCase(error.details[0].context.key);
    let type = error.details[0].type.split(".");
    type = module.exports.toUpperCase(type[1]);
    key = apiTag + key + type;
    return key;
  },
  
};
