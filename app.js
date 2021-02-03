const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

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
            events: [String!]!
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
            return ['Job Application for Gooble', 'Workout', 'Project Dephosphorus']
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}));

app.listen(3333);