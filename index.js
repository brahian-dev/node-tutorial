const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use((request, response, next) => {
  console.log('Method', request.method)
  console.log('Path', request.path)
  console.log('Body', request.body)
  console.log('-----------')
  next()
})

let notes = [
  {
    id: 1,
    content: 'Test Note Content',
    date: '2020-01-01',
    important: true
  },
  {
    id: 2,
    content: 'Test Note Content',
    date: '2020-01-01',
    important: true
  },
  {
    id: 3,
    content: 'Test Note Content',
    date: '2020-01-01',
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1> Hello World </h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find((note) => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)

  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'Note is Required'
    })
  }

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  response.json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Route not Found'
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`)
})
