"use strict";
const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-2",
});

const rek = new AWS.Rekognition();
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  console.log(event);
  const { s3 } = event.Records[0];
  const { key } = s3.object;
  const id = key.split("/")[1];

  const indexParams = {
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

  const detectParams = {
    Image: {
      S3Object: {
        Bucket: "bayaar-bucket",
        Name: key,
      },
    },
    Attributes: ['ALL']
  };

  const indexResponse = await rek.indexFaces(indexParams).promise();
  const detectResponse = await rek.detectFaces(detectParams).promise()
  const { Type, Confidence } = detectResponse.FaceDetails[0].Emotions[0]

  const userId = `userId:${id}`

  const timestamp = new Date().toISOString()
  const params = {
    TableName: "attendance",
    Item: {
      userId, confidence: Confidence, emotion: Type, timestamp
    }
  }

  try {
    await docClient.put(params).promise()
    console.log("success")
  } catch (err) {
    console.log(err.message)
    return err.message
  }

  return {
    "message": "Item successfully added"
  }
};
