const apiRouter = require('express').Router(); 

const addUser = (req, res, next)=>{
    const { email} = req.body;
    console.log(email);
    res.send({mesaage: "success"})
}

apiRouter.route('/subscribe')
    .post(addUser)

apiRouter.get('/', function(req, res, next) {
    res.send('API is working properly');
});
    
module.exports = apiRouter;