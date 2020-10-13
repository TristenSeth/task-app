require('../src/db/mongoose')
const User = require('../src/models/user')
const Task = require('../src/models/tasks')

//5f84d4a097f3251edca113c7

// User.findByIdAndUpdate('5f84d4a097f3251edca113c7', { age: 1 }).then((user) => {
//     console.log(user)

//     return User.countDocuments({age: 1})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

// const updateAgeAndCount = async (id, age) => {
//     const user = await User.findByIdAndUpdate(id, { age })
//     const count = await User.countDocuments({ age })
//     return count
// }

// updateAgeAndCount('5f84d4a097f3251edca113c7', 2).then((count) => {
//     console.log(count)
// }).catch((e)=> [
//     console.log(e)
// ])

const delete_task_and_count = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return count
}

delete_task_and_count('5f85f1740dabac066b33a7bc').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})