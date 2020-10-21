const mongoose = require('mongoose')


const task_schema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trime: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})
/* task model:
 * description: string describing what the task is
 * completed: boolean of the status of task
 */
const Task = mongoose.model('Task', task_schema)

module.exports = Task