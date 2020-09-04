const express = require('express')
const app = express()
const cors = require('cors')
const apiRouter = require('./routes/apiRoutes') 

app.use(express.urlencoded({ extended: true }))

app.use(cors())

app.use(express.json())

app.use('/', apiRouter)

module.exports = app