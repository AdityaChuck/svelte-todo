const { gql } = require('apollo-server')

module.exports = gql`
    type Todo{
        id: ID!
        body: String!
        createdAt: String!
        done: Boolean!
    }
    type Query{
        getTodos: [Todo]
        getTodo(id: ID!): Todo
    }
    type Mutation{
        createTodo(body: String!): Todo!
        deleteTodo(id: ID!): String!
        editTodo(id: ID!, body: String!): Todo!
        doneToggler(id: ID!):Boolean!
    }
`