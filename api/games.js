const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.readData = async (event) => {
  AWS.config.update({
    region: "us-east-2",
  });

  const params = {
    TableName: "Games",
  };

  try {
    const response = await docClient.scan(params).promise();
    return response;
  } catch (err) {
    return err.message;
  }
};

module.exports.writeData = async (event) => {
  const { user_id, game_id, player_score } = event.body;
  const timestamp = new Date().toISOString();
  const params = {
    TableName: "Games",
    Item: {
      user_id,
      game_id,
      player_score,
      timestamp,
    },
  };

  try {
    await docClient.put(params).promise();
  } catch (err) {
    return err.message;
  }

  return {
    message: "Game item successfully added",
  };
};

module.exports.checkByUser = async (event) => {
  let params = {
    TableName: "Games",
    KeyConditionExpression: "user_id = :id",
    ExpressionAttributeValues: {
      ":id": "user123",
    },
  };

  let data = docClient.query(params).promise();

  return data;
};
