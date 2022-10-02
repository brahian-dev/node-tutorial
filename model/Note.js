const { model, Schema } = require('mongoose')

const noteShema = new Schema({
  content: String,
  date: Date,
  important: Boolean
})

noteShema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = model('Note', noteShema)

module.exports = Note

// Find Data Model
// Note.find({}).then(result => {
//   console.log(result)
//   mongoose.connection.close()
// })

// Save Mode of Data
// const note = new Note({
//   content: 'MongoDB is so Cool !',
//   date: new Date(),
//   important: true
// })

// note.save()
//   .then((result) => {
//     console.log(result)
//     mongoose.connection.close()
//   })
//   .catch((err) => {
//     console.error(err)
//   })
