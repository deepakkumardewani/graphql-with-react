const express = require('express')
const models = require('./models')
const expressGraphQL = require('express-graphql')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const schema = require('./schema/schema')

const app = express()

const MONGO_URI = 'mongodb://127.0.0.1/testdb'
if (!MONGO_URI) {
  throw new Error('You must provide a MongoDB URI')
}

// connect to Mongo when the app initializes
const options = {
  promiseLibrary: global.Promise
}

mongoose.Promise = global.Promise
mongoose.connect(MONGO_URI, options).then(db => console.log('connected to MongoDB'))

app.use(bodyParser.json())
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}))

const webpackMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')
const webpackConfig = require('../webpack.config.js')
app.use(webpackMiddleware(webpack(webpackConfig)))

module.exports = app
