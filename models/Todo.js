const { model, Schema } = require("mongoose")

const todoSchema = new Schema({
    body: String,
    createdAt: String,
    done: Boolean
})

module.exports = model('Todo', todoSchema)