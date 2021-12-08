"use strict";
const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-2",
});

const rek = new AWS.Rekognition();

module.exports.handler = async (event) => {
  console.log(event);
  const { s3 } = event.Records[0];
  const { key } = s3.object;
  const id = key.split("/")[1];

  let params = {
    CollectionId: "MyCollection",
    DetectionAttributes: [],
    ExternalImageId: id,
    Image: {
      S3Object: {
        Bucket: "bayaar-bucket",
        Name: key,
      },
    },
  };

  const response = await rek.indexFaces(params).promise();
  console.log(response.FaceRecords[0])
  return { message: "success", response };
};
