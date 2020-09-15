
'use strict';
const AWS = require('aws-sdk');

AWS.config.update({region: 'eu-west-2'});

exports.handler = async (event, context)=> {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'});

    let responseBody = '';
    let statusCode = 0 ;

    const { id, email} = JSON.parse(event.body);

    const params = {
        TableName: "Subscribers",
        Item:{
            id:id,
            email:email
        }
    };

    try{
      const data= await  documentClient.put(params).promise();

      responseBody = JSON.stringify({...data, "message":"Successfully added to DB" })
      statusCode = 201;
    }catch(err){
        responseBody = `Unable to put subscriber email`;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers:{
            
        },
        body: responseBody
    }
;
    return response;
};
