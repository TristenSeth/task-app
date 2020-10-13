require('../src/db/mongoose')
const Task = require('../src/models/tasks')

Task.findByIdAndDelete('5f85f1570dabac066b33a7ba',).then((task) => {
    console.log(task)
    return Task.countDocuments({completed: false})
}).then((taskCount) => {
    console.log(taskCount)
}).catch((e) => {
    console.log(e)
})