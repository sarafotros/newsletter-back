const fetch = require('node-fetch');
const gatewayAPIUrl = 'https://8koyu5qyv1.execute-api.eu-west-2.amazonaws.com/dev/'


const get = (endpoint) => {
    return fetch(gatewayAPIUrl + endpoint)
     .then(resp => resp.json())
}


const post = (endpoint, obj) =>{
    const configObj = {
        method : 'POST',
        headers: {
            "Content-Type": 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(obj)
    }
    return fetch(gatewayAPIUrl + endpoint , configObj)
     .then(resp => resp.json())

}



module.exports = {get, post}