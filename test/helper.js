const { app  } = require('../index')
const supertest = require('supertest')
const api = supertest(app)

const initialNotes = [
    {
        content: 'Hola, mi nombre es Brahian y estoy creciendo en mi carrera Profesional 😊',
        important: true,
        date: new Date()
    },
    {
        content: 'Puedes encontrarme en GitHub como @brahian-dev',
        important: true,
        date: new Date()
    },
    {
        content: 'Gracias a todos por ser parte de este proceso 🥳',
        important: true,
        date: new Date()
    }
]

const getAllNotes = async () => {
    const result = await api.get('/api/notes')
    return {
        notes: result.body.map( note => note.content),
        result
    }

}

module.exports = {
    initialNotes,
    api,
    getAllNotes
}