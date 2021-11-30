"use strict";
const randomWords = require("random-words");

module.exports.getRandomWords = async (event) => {
  const response = await randomWords(event.number);
  return {
    "statusCode": 200,
    "body": JSON.stringify({response})
  }
};
