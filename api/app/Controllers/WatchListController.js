const conn = require("../../database/mySQLconnect");
const { apiResponse } = require("../../MiscUtils");
const { getIDFromAccessToken } = require("./AccountController");



module.exports = {createList}