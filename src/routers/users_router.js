const express = require('express')
const User = require('../models/user')
const router = new express.Router()


/* Path to create an individual user in the database
 * Sends a 201 code back to requestor on success, and
 * a 400code on error
 */
router.post('/users', async (req, res) => {
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

/* Path to get all users. On error sends back a 500 status to requestor
 * On success sends back list of users in the database
 */
router.get('/users', async (req, res) => {
    //find all users in database
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

/* Path to get individual users by id. If no user is found, return a 404 status to requestor
 * If user is found, return user to requestor with default status code. Otherwise, on error return a 500 status
 */
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            //no user found
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})


/* Path to update a user by ID using the patch http method/header
 * Takes in the user/:id path where :id represents the user id in our mongoDB database
 * It checks if the update is a valid operation (changes a valid field for our user model)
 * and runs our validator tests against the updated user. If it is not a valid update,
 * we send a 400 status back. Otherwise, if a user is not found we send a 404 and a 200 on success.
 * On error, we send a 400 code back to the client.
 */
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed_updates = ['name', 'email', 'password', 'age']
    const is_valid_operation = updates.every((update) => allowed_updates.includes(update))

    //check if invalid operations where requested
    if (!is_valid_operation) {
        return res.status(400).send({error: "Invalid updates!"})
    }

    try {
        //asynchronously find user by id and update them. Return the new updated user and run validator tests on it.
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

        //check that we found a user
        if (!user) {
            //no user found
            return res.status(404).send()
        }

        //send updated user back to requestor
        res.send(user)
    } catch (e) {
        //error occured
        res.status(400).send(e)
    }
})

/* Path for delete http method to delete individual users by id in our database
 *  takes in the users/:id path and tries to delete the user. If no user is found a 404 status
 * is sent back. If a user is found the deleted users info is sent back with a 200 status code
 * if an error occurs a 500 status is sent back
 */
router.delete('/users/:id', async (req, res) => {
    try {
        //try to find and delete user
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            //no user found
            return res.status(404).send()
        }

        //user found
        res.send(user)
    } catch (e) {
        //error occured; perhaps incorrect body for request?
        res.status(500).send()
    }
})


module.exports = router