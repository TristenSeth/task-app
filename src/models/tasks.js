const mongoose = require('mongoose')

/* task model:
 * description: string describing what the task is
 * completed: boolean of the status of task
 */
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