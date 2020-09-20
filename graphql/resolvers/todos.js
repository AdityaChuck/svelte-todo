const { UserInputError } = require("apollo-server")

const Todo = require("../../models/Todo")

module.exports = {
    Query: {
        async getTodos(){
            try{ 
                const todos = await Todo.find().sort({ createdAt: -1 })
                if(todos){
                    return todos
                }
                else{
                    throw new Error("No Todos found")
                }
            }catch(err){
                throw new Error(err)
            }
        },
        async getTodo(_, { id }){
            try{
                const todo = await Todo.findById(id)
                if(todo){
                    return todo
                }else{
                    throw new Error("Todo not found")
                }
            }catch(err){
                throw new Error(err)
            }
        }
    },
    Mutation: {
        async createTodo(_, {body}){
            if(body.trim() === ''){
                throw new Error('Todo body must not be empty')
            }
            const newTodo = new Todo({
                body,
                createdAt: new Date().toISOString(),
                done: false
            })
            const todo = await newTodo.save()

            return todo
        },

        async deleteTodo(_, {id}){
            try{
                const todo = await Todo.findById(id)
                await todo.deleteOne()
                return 'Todo deleted successfully!'
            }catch(err){
                throw new Error(err)
            }
        },
        async doneToggler(_, {id}){
            try {
                const doc = await Todo.findById(id)
                doc.done = !doc.done
                doc.save()
                return doc.done
            } catch (error) {
                throw new Error(error)
            }
        },
        async editTodo(_, {id, body}){
            try{
                const doc = await Todo.findById(id)
                doc.body = body
                doc.save()
                return doc
            }catch(err){
                throw new Error(err)
            }
        }
    }
}