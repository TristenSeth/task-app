const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


/* Path to create an individual user in the database
 * Sends a 201 code back to requestor on success, and
 * a 400code on error
 */
router.post('/users', async (req, res) => {
    //create the user
    const user = new User(req.body)

    try {
        const token = await user.generate_auth_token()
        //try to save user
        await user.save()
        res.status(201).send({user, token})
    } catch (e) {
        //promise during await func failed
        res.status(400).send(e)
    }
})

/* Path to log user in
 */
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //generate a json token for user
        const token = await user.generate_auth_token()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})  


/* Route to log user out
 *
 */
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            //return true when token we see is not current token for authorization
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

/* Logout user of all sessions
 *
 */
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        //empty the tokens array
        req.user.tokens = [[]]
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


/* Path to get current user info. On error sends back a 500 status to requestor
 * On success sends back user in the database
 */
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


/* Path to update a user by ID using the patch http method/header
 * Takes in the user/:id path where :id represents the user id in our mongoDB database
 * It checks if the update is a valid operation (changes a valid field for our user model)
 * and runs our validator tests against the updated user. If it is not a valid update,
 * we send a 400 status back. Otherwise, if a user is not found we send a 404 and a 200 on success.
 * On error, we send a 400 code back to the client.
 */
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed_updates = ['name', 'email', 'password', 'age']
    const is_valid_operation = updates.every((update) => allowed_updates.includes(update))

    //check if invalid operations where requested
    if (!is_valid_operation) {
        return res.status(400).send({error: "Invalid updates!"})
    }

    try {
        //grab user from auth 
        const user = req.user

        //update each property of user dynamically
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        

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
router.delete('/users/me', auth, async (req, res) => {
    try {
        //remove the user from the database
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        //error occured; perhaps incorrect body for request?
        res.status(500).send()
    }
})


module.exports = router