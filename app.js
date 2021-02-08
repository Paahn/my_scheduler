const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const appSchema = require('./graphql/schema/index');
const appResolvers = require('./graphql/resolvers/index');

const app = express();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@myscheduler.zb5gm.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

app.use(bodyParser.json());


app.use('/graphql', graphqlHTTP({
    schema: appSchema,
    rootValue: appResolvers,
    graphiql: true
}));

mongoose.connect(uri, { useNewUrlParser: true })
 .then(() => {
     app.listen(3333);
 })
 .catch(err => {
     console.log(err);
 });
