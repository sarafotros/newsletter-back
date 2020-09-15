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
   <body style="height: 100%; margin: 2%; background: #fff; padding:2% ;
   font-family: 'Comic Sans MS';">
     <div style="background-image:url('https://raw.githubusercontent.com/ColorlibHQ/email-templates/master/10/images/email.png'); background-repeat: no-repeat;
       background-position: center;
        background-repeat:no-repeat;
         background-size:initial;
          padding:8%;
          background-color: #edf2fa99;" >
       <h1>
             Welcome to My <a href='https://www.moonpig.com/uk/'>Moonpig</a>!
       </h1>
          <h2 style="font-size:22px; ">Hi ${email},</h2>
          <h3 style="font-size:20px; ">Thanks for joinin the Moonpig community </h3>
          <p style="font-size:16px; ">Until recently, the prevailing view assumed lorem ipsum was born as a nonsense text. “It's not Latin, though it looks like it, and it actually says nothing,” Before & After magazine answered a curious reader, “Its ‘words’ loosely approximate the frequency with which letters occur in English, which is why at a glance it looks pretty real.”
              As Cicero would put it, “Um, not so fast.”</p>
          <p style="font-size:16px; ">The placeholder text, beginning with the line “Lorem ipsum dolor sit amet, consectetur adipiscing elit”, looks like Latin because in its youth, centuries ago, it was Latin.</p>
          <div style="height:100%;">
           <img src='https://seeklogo.com/images/M/moonpig-logo-AED2FFA4AE-seeklogo.com.png' width="140" height="130" alt='logo'/>
         </div>
     </div>
   </body>
  </html>

   const textBody = `
     Hi ${email},
     ...
   `;

  // Create sendEmail params
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
             console.log('error',err);
             context.fail(err);
         } else {
            
             console.log('succeed',data);
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