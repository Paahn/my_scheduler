const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];

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

app.listen(3333);