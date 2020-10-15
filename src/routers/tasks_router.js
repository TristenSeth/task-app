const express = require('express')
const Task = require('../models/tasks')
const router = new express.Router()

/* Path to create an individual task in the database
 * Sends a 201 code back to requestor on success, and
 * a 400 code on error
 */
router.post('/tasks', async (req, res) => {
    //create new task
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send()
    }
})

/* Path to get all tasks. On error sends back a 500 status to requestor
 * On success sends back list of tasks in the database
 */
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) { 
        res.status(500).send()
    }
})

/* Path to get individual tasks by id. If no task is found, return a 404 status to requestor
 * If task is found, return task to requestor with default status code. Otherwise, on error return a 500 status
 */
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        
        if (!task) { return res.status(404).send() }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

})


/* Path to update a task by ID using the patch http method/header
 * Takes in the task/:id path where :id represents the task id in our mongoDB database
 * It checks if the update is a valid operation (changes a valid field for our task model)
 * and runs our validator tests against the updated task. If it is not a valid update,
 * we send a 400 status back. Otherwise, if a task is not found we send a 404 and a 200 on success.
 * On error, we send a 400 code back to the client.
 */
router.patch('/tasks/:id', async (req, res) => {
    //verify its a legal operation
    const updates = Object.keys(req.body)
    const allowed_updates = ['description', 'completed']
    const is_valid_update = updates.every((update) => allowed_updates.includes(update))

    if (!is_valid_update) {
        return res.status(400).send('Invalid Update on task!')
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        //no task found
        if (!task) {
            return res.send(404).send()
        }

        res.send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})

/* Path for delete http method to delete individual task by id in our database
 *  takes in the tasks/:id path and tries to delete thetask. If notask is found a 404 status
 * is sent back. If atask is found the deleted task info is sent back with a 200 status code
 * if an error occurs a 500 status is sent back
 */
router.delete('/tasks/:id', async (req, res) => {
    try {
        //try to find and delete task
        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            //no task found
            return res.status(404).send()
        }

        //task found
        res.send(task)
    } catch (e) {
        //error occured; perhaps incorrect body for request?
        res.status(500).send()
    }
})

module.exports = router