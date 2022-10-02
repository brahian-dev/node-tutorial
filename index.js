require('dotenv').config()
require('./mongobd')
const express = require('express')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const cors = require('cors')
const app = express()
const Note = require('./model/Note')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')

Sentry.init({
  dsn: 'https://fa069cc89b274c0aa9fdc689846be1ac@o1394914.ingest.sentry.io/6717216',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

app.use(cors())
app.use(express.json())

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use((request, response, next) => {
  console.log('Method', request.method)
  console.log('Path', request.path)
  console.log('Body', request.body)
  console.log('-----------')
  next()
})

app.get('/', (request, response) => {
  response.send('<h1> Hello World </h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(err => {
    next(err)
  })
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  }).catch(err => {
    next(err)
  })
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'Note is Required'
    })
  }

  const newNoteInfo = {
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.status(500).json(result)
    })
    .catch(err => {
      next(err)
    })
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'Note is Required'
    })
  }

  const newNote = new Note({
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  })

  newNote.save().then(notedSaved => {
    response.json(notedSaved)
  })
})

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.use(notFound)
app.use(handleError)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`)
})
