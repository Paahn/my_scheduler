const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const app = express();

const events = [];
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@myscheduler.zb5gm.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

app.use(bodyParser.json());

// app.get('/', (request, response, next) => {
//     response.send('Server online! 🤖');
// })

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            date: String!
            time: String!
        }
        type RootQuery {
            events: [Event!]!
        }

        input EventInput {
            title: String!
            description: String!
            date: String!
            time: String!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return events;
        },
        createEvent: ({eventInput}) => {
            const event = {
                _id: Math.random().toString(),
                title: eventInput.title,
                description: eventInput.description,
                date: eventInput.date,
                time: eventInput.time
            };
            events.push(event);
            return event;
        }
    },
    graphiql: true
}));

mongoose.connect(uri, { useNewUrlParser: true })
 .then(() => {
     app.listen(3333);
 })
 .catch(err => {
     console.log(err);
 });

// app.listen(3333);