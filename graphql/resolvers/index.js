const todoResolvers = require("./todos")

module.exports = {
    Query: {
        ...todoResolvers.Query
    },
    Mutation: {
        ...todoResolvers.Mutation
    }
}