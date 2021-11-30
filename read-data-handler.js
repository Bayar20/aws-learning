const AWS = require('aws-sdk')
const randomWords = require('random-words')

const getAllItems = async () => {
    const docClient = new AWS.DynamoDB.DocumentClient();
    
    return new Promise((resolve, reject) => {
        docClient.scan({TableName: 'attendance'}, (err, data)=>{
            if(err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
     });
}

module.exports.readData = async (event) => {
    // TODO implement

    AWS.config.update({
      region: "us-east-2",
    });
    
    const docClient = new AWS.DynamoDB({apiVersion: '2012-8-10'});
    
    const params = {
        TableName: 'attendance',
        // Key:{
        //     "userId": "10002"
        // }
    };
    
    const data1 = await getAllItems();
    const data2 = await docClient.scan(params).promise()
    
    const response = data2.Items.map((item) =>  
        AWS.DynamoDB.Converter.unmarshall(item, {
          string: {S: 'foo'},
          number: {N: '123'},
        })
    ) 

    const words = randomWords(3)
    
    return [...response, ...words]
};
