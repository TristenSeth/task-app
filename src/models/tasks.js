const mongoose = require('mongoose')

//create task model
const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trime: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    }
})

module.exports = Task