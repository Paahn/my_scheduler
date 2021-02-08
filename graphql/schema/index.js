const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Event {
    _id: ID!
    title: String!
    description: String!
    date: String!
    time: String!
    creator: User!
}

type User {
    _id: ID!
    email: String!
    password: String
    username: String!
    createdEvent: [Event!]
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

input UserInput {
    email: String!
    password: String!
    username: String!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);