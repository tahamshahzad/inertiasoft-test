// 'use strict';
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient();
module.exports.deleteBook = (event, context, callback) => {
  console.log(event, context)
  const {pathParameters} = event;
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    // will update if the hashkey already exist
    Item: {
      UUID : pathParameters.uuid,
    }
  }
  

  
  dynamodb.delete(params, function(err, data) {
    if (err) console.log(err);
    else  {
      const response = {
        statusCode: 200,
        body: JSON.stringify(data.Item)
      }
      callback(null, response)
    }
  });
}
module.exports.updateBook = (event, context, callback) => {
  console.log(event, context)
  const {pathParameters} = event;
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    // will update if the hashkey already exist
    Item: {
      UUID : pathParameters.uuid,
      ...JSON.parse(event.body)
    }
  }
  

  
  dynamodb.put(params, function(err, data) {
    if (err) console.log(err);
    else  {
      const response = {
        statusCode: 200,
        body: JSON.stringify(data.Item)
      }
      callback(null, response)
    }
  });
}
module.exports.getBook = (event, context, callback) => {
  const {pathParameters} = event;

  var params = {
    TableName : process.env.DYNAMODB_TABLE,
    Key: {
      UUID: pathParameters.uuid
    }
  };
  

  
  dynamodb.get(params, function(err, data) {
    if (err) console.log(err);
    else  {
      const response = {
        statusCode: 200,
        body: JSON.stringify(data.Item)
      }
      callback(null, response)
    }
  });
}

module.exports.create = (event, context, callback) => {
  // const timestamp = new Date().getTime()
  const data = JSON.parse(event.body);
  // if (typeof data.text !== 'string') {
  //   console.error('Validation Failed')
  //   callback(new Error('Couldn\'t create the todo item.'))
  //   return
  // }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      UUID : data.UUID || data.uuid,
      name : data.name,
      releaseDate : data.releaseDate,
      authorName : data.authorName
    }
  }


  // write the todo to the database
  dynamodb.put(params, (error, result) => {

    // handle potential errors
    if (error) {
      console.log(error);
      console.error(error)
      callback(new Error('Couldn\'t create the book'))
      return
    }
    
    console.log(result);
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    }
    callback(null, response)
  })
  // return {
  //   statusCode: 200,
  //   body: JSON.stringify(
  //     {
  //       message: 'Go Serverless v1.0! Your function executed successfully!',
  //       // input: event,
  //     },
  //     null,
  //     2
  //   ),
  // };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
