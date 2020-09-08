'use strict';
const AWS = require('aws-sdk');

AWS.config.update({region: 'eu-west-2'});

exports.handler = async (event, context)=> {
    // const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08"});
    const documentClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'});

    let responseBody = '';
    let statusCode = 0 ;

    const { id, email} = JSON.parse(event.body);
    // console.log('event',event)

    const params = {
        TableName: "Subscribers",
        Item:{
            id:id,
            email:email
        }
    };

    try{
      const data = await documentClient.put(params).promise();

      responseBody = JSON.stringify({...data, "message":"Successfully added to DB" })
      statusCode = 201;
      
      const res = {
          body:email,
          statusCode
        };
      context.succeed(res);
      console.log(res)
    
    }catch(err){
        responseBody = JSON.stringify({err, "message":"Unable to put subscriber email" });
        statusCode = 403;
        const errContex = {
            body:responseBody,
            statusCode
        } 
        context.fail(errContex)
    }

//     const response = {
//         statusCode: statusCode,
//         headers:{
            
//         },
//         body: responseBody
//     }
// ;
    // return res;
};