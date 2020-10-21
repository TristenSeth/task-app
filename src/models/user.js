const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//create the user scheme
const user_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            //make sure password doesnt contain 'password'
            if (validator.contains(value, 'password', {ignoreCase: true})) {
                throw new Error('Password contains \'password\'')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            //check that it is a valid email
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid.')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                //checking if age is negative
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
            unique: true
        }
    }]
})


user_schema.methods.toJSON = function () {
    const user = this
    const user_object = user.toObject()

    delete user_object.password
    delete user_object.tokens

    return user_object
}
//custom method for issuing json auth token
user_schema.methods.generate_auth_token = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'thisismyfirstproject')

    //add token to user tokens array
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//custom method to log user in by credentials
user_schema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("Unable to log in.")
    }

    const is_match = await bcrypt.compare(password, user.password)

    if (!is_match) {
        throw new Error('Unable to login.')
    }

    return user
}

//middleware to hash passwords right before a user is saved to the database
user_schema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

/* User model:
 * name: Users name
 * password: password for the user's account
 * email: users email address
 * age: optional user's age
 */
const User = mongoose.model('User', user_schema)


//export
module.exports = User