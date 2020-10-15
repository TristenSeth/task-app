const mongoose = require('mongoose')
const validator = require('validator')

/* User model:
 * name: Users name
 * password: password for the user's account
 * email: users email address
 * age: optional user's age
 */
const User = mongoose.model('User', {
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
    }
})


//export
module.exports = User