const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

const app = express();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@myscheduler.zb5gm.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

app.use(bodyParser.json());

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
            return Event
            .find()
            .then(events => {
                return events.map(event => {
                    return {...event._doc};
                });
            })
            .catch(err => {
                throw err;
            });
        },
        createEvent: ({eventInput}) => {
            const event = new Event({
                title: eventInput.title,
                description: eventInput.description,
                date: new Date(eventInput.date),
                time: eventInput.time
            });
            return event
            .save()
            .then(result => {
                console.log(result);
                return {...result._doc};
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
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
