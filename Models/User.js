const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
  },
})

// // Encrypt password before saving
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next()
//   }
//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
//   next()
// })

// // Match user password
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password)
// }

module.exports = mongoose.model('User', UserSchema)