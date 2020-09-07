'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: "eu-west-2"});


exports.handler = async (event, context) => {
  const SES = new AWS.SES({region: 'eu-west-2'});
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: "eu-west-2"});
  let responseBody = "";
  let statusCode = 0;

  const { id, email } = JSON.parse(event.body);
  
  
  // part1: sending email
  
   const htmlBody = `
     <!DOCTYPE html>
     <html>
       <head>
       </head>
       <body>
         <p>Hi ${email},</p>
         <p>...</p>
       </body>
     </html>
   `;

   const textBody = `
     Hi ${email},
     ...
   `;

  // // Create sendEmail params
   const emailParams = {
     Destination: {
       ToAddresses: ['sarafotros@gmail.com', 'sf.ofoghnet@gmail.com']
     },
     Message: {
       Body: {
         Html: {
           Charset: "UTF-8",
           Data: htmlBody
         },
         Text: {
           Charset: "UTF-8",
           Data: textBody
         }
       },
       Subject: {
         Charset: "UTF-8",
         Data: "Thanks for subscribing!"
       }
     },
     Source: "sarafotros@gmail.com"
   };

  
   SES.sendEmail(emailParams, function (err, data) {
         // callback(null, {err: err, data: data});
         if (err) {
             console.log('errrrrrrrrrrror',err);
             context.fail(err);
         } else {
            
             console.log('succeeeed',data);
             context.succeed(event);
         }
     });
  

  // part2: sending response

  const params = {
    TableName: "EmailsH",
    Item: {
      id,
      email
    }
  };
  
  if (validateEmail(email)) {
        try {
            const data = await documentClient.put(params).promise();
            responseBody = JSON.stringify(data);
            statusCode = 201;
        } catch (err) {
            responseBody = JSON.stringify({"message":"Unable to save user"});
            statusCode = 400;
        }
  } else {
        responseBody = JSON.stringify({"message":"Invalid Email Address"});
        statusCode = 400;
  }

  const response = {
    statusCode: statusCode,
    headers: {
    },
    body: responseBody
  };

  return response;
};

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}