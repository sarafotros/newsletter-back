const apiRouter = require('express').Router(); 
const apiMethod = require('../API')
const uniqid = require('uniqid');

const addUser = (req, res, next)=>{
    const { email} = req.body;
    const obj = {
        id: uniqid(),
        email: email}
    apiMethod.post('subscribe', obj)
        .then(resp=> {
            console.log(resp);
        })
    console.log(email);
    res.status(201).json({message: {msgBody: "your email successfully added to subscription list"}});
}

apiRouter.route('/subscribe')
    .post(addUser)

apiRouter.get('/', function(req, res, next) {
    res.send('API is working properly');
});
    
module.exports = apiRouter;