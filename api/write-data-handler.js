const AWS = require("aws-sdk")

AWS.config.update({
  region: "us-east-2",
});

const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.writeData = async (event) => {
    const {userId, emotion, confidence} = event.body
    const timestamp = new Date().toISOString()
    const params = {
        TableName:"attendance",
        Item:{
            userId, confidence, emotion, timestamp
        }
    }
    
    try {
         await docClient.put(params).promise()
    } catch (err) {
        return err.message
    }
    
    return {
        "message": "Item successfully added"
    }
}