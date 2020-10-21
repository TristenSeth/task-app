const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/tasks')
const user_router = require('./routers/users_router')
const task_router = require('./routers/tasks_router')


const app = express()
//listen on whatever port is given, or if none is given use port 3000 for local tests
const port = process.env.PORT || 3000

//middleware for when under maintenence
// app.use((req, res, next) => {
//     res.status(503).send('Site under maintenence.')
// })


//make sure it automatically parses json data
app.use(express.json())

//set up user and task routers
app.use(user_router)
app.use(task_router)



//set app to listen on port
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})