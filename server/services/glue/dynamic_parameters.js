'use strict'

/**
 * Replace dynamic parameters in a string
 * @param {String} string
 * @param {JSON} dynamicParameters
 * @returns {String} newString - The string with the dynamic parameters replaced
 */
const replaceDynamicParameters = (string, dynamicParameters) => {
  let newString = string

  dynamicParameters.forEach(dynamicParameter => {
    newString = newString.replace(
      '$' + dynamicParameter.name,
      dynamicParameter.value
    )
  })
  return newString
}

module.exports = {
  replaceDynamicParameters
}
