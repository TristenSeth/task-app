const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        //grab auth token from header
        const token = req.header('Authorization').replace('Bearer ', '')
        //verify the token is correct
        const decoded = jwt.verify(token, 'thisismyfirstproject')
        //look for user using the decoded ID field from the token
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({error: "Please authenticate."})
    }


    // next()
}

module.exports = auth