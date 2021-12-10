"use strict";
const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-2",
});

const rek = new AWS.Rekognition();

module.exports.handler = async (event) => {
  const { name } = event.headers;
  console.log(name)

  const params = {
    CollectionId: "MyCollection",
    FaceMatchThreshold: 50,
    Image: {
      S3Object: {
        Bucket: "bayaar-bucket",
        Name: `uploads/${name}`,
      },
    },
    MaxFaces: 1
  };
  
    const response = await rek.searchFacesByImage(params).promise();
    return response;

};
