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
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
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
}));

app.listen(3333);