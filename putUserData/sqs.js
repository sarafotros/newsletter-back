'use strict';
const AWS = require('aws-sdk');

AWS.config.update({region: 'eu-west-2'});

exports.handler = async (event, context)=> {
    const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08"});
    const documentClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'});

    // Create an SQS service object
    const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    
    console.log('body',event.body)

   
    const { id, email} = JSON.parse(event.body);
    
     const paramsSQS = {
      QueueUrl: 'https://sqs.eu-west-2.amazonaws.com/980474985817/subscriberQueue',
      MessageBody: email
      
    };
    
    const queudata = await sqs.sendMessage(paramsSQS).promise()
    console.log(queudata);
    
    
    let responseBody = '';
    let statusCode = 0 ;

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

    // const response = {
    //     statusCode: statusCode,
    //     headers:{
            
    //     },
    //     body: responseBody
    // };
    // return res;
};














// 'use strict';
// const AWS = require('aws-sdk');
// AWS.config.update({ region: "eu-west-2"});


// exports.handler = async (event, context) => {
//   const SES = new AWS.SES({region: 'eu-west-2'});
//   const documentClient = new AWS.DynamoDB.DocumentClient({ region: "eu-west-2"});
//   let responseBody = "";
//   let statusCode = 0;

//   const { id, email } = JSON.parse(event.body);
  
  
//   // part1: sending email
  
//   const htmlBody = `
//      <!DOCTYPE html>
//      <html>
//       <head>
//       </head>
//       <body style="background-color:#eaeded;">
//       <h1 style="text-align:center;">
//             Thank for joining <a href='https://www.moonpig.com/uk/'>Moonpig</a> subscription
//       </h1>
//          <h2>Hi ${email},</h2>
//          <p>...this is a test... </p>
//          <div style="height:100%;">
//           <img src='https://seeklogo.com/images/M/moonpig-logo-AED2FFA4AE-seeklogo.com.png' width="100" height="90" alt='logo'/>
//         </div>
//       </body>
//      </html>
//   `;

//   const textBody = `
//      Hi ${email},
//      ...
//   `;

//   // // Create sendEmail params
//   const emailParams = {
//      Destination: {
//       ToAddresses: [email]
//      },
//      Message: {
//       Body: {
//          Html: {
//           Charset: "UTF-8",
//           Data: htmlBody
//          },
//          Text: {
//           Charset: "UTF-8",
//           Data: textBody
//          }
//       },
//       Subject: {
//          Charset: "UTF-8",
//          Data: "Thanks for subscribing!"
//       }
//      },
//      Source: "ajambandmusic@gmail.com"
//   };

  
//   SES.sendEmail(emailParams, function (err, data) {
//          // callback(null, {err: err, data: data});
//          if (err) {
//              console.log('errrrrrrrrrrror',err);
//              context.fail(err);
//          } else {
            
//              console.log('succeeeed',data);
//              context.succeed(event);
//          }
//      });
  

//   // part2: sending response

//   const params = {
//     TableName: "EmailsH",
//     Item: {
//       id,
//       email
//     }
//   };
  
//   if (validateEmail(email)) {
//         try {
//             const data = await documentClient.put(params).promise();
//             responseBody = JSON.stringify(data);
//             statusCode = 201;
//         } catch (err) {
//             responseBody = JSON.stringify({"message":"Unable to save user"});
//             statusCode = 400;
//         }
//   } else {
//         responseBody = JSON.stringify({"message":"Invalid Email Address"});
//         statusCode = 400;
//   }

//   const response = {
//     statusCode: statusCode,
//     headers: {
//     },
//     body: responseBody
//   };

//   return response;
// };

// function validateEmail(email) {
//     const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
// }