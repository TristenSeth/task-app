const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/tasks')
const user_router = require('./routers/users_router')
const task_router = require('./routers/tasks_router')


const app = express()
//listen on whatever port is given, or if none is given use port 3000 for local tests
const port = process.env.PORT || 3000

//make sure it automatically parses json data
app.use(express.json())
app.use(user_router)
app.use(task_router)

//set app to listen on port
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})