const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/tasks')


const app = express()
const port = process.env.PORT || 3000

//make sure it automatically parses json data
app.use(express.json())


//user creation endpoint
app.post('/users', async (req, res) => {
    //create the user
    const user = new User(req.body)

    try {
        //try to save user
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        //promise during await func failed
        res.status(400).send(e)
    }
})

//endpoint to get users
app.get('/users', async (req, res) => {
    //find all users in database
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

//endpoint to get individual users
app.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})


//update a user by id
app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed_updates = ['name', 'email', 'password', 'age']
    const is_valid_operation = updates.every((update) => allowed_updates.includes(update))

    //check if invalid operations where requested
    if (!is_valid_operation) {
        return res.status(400).send({error: "Invalid updates!"})
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

        //check that we found a user
        if (!user) {
            //no user found
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//task creation endpoint
app.post('/tasks', async (req, res) => {
    //create new task
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send()
    }
})

//endpoint to fetch all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) { 
        res.status(500).send()
    }
})

//endpoint to fecth task by id
app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        
        if (!task) { return res.status(404).send() }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

})

app.patch('/tasks/:id', async (req, res) => {
    //verify its a legal operation
    const updates = Object.keys(req.body)
    const allowed_updates = ['description', 'completed']
    const is_valid_update = updates.every((update) => allowed_updates.includes(update))

    if (!is_valid_update) {
        return res.status(400).send('Invalid Update on task!')
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        //no user found
        if (!task) {
            return res.send(404).send()
        }

        res.send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})

//set app to listen on port
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})