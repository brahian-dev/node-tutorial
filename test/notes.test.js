const mongoose = require('mongoose')
const { server  } = require('../index')
const Note = require('../model/Note')
const {
    initialNotes,
    api,
    getAllNotes
 } = require('./helper')

beforeEach(async () => {
    await Note.deleteMany({})

    for (const note of initialNotes) {
        const noteObject = new Note(note)
        await noteObject.save()
    }
})

test('Check response to Notes is a JSON', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('Check if exist Notes', async () => {
    const notes = await api.get('/api/notes')
    expect(notes.body).toHaveLength(initialNotes.length)
})

test('Check content of Note', async () => {
    const { notes } = await getAllNotes()

    expect(notes).toContain('Hola, mi nombre es Brahian y estoy creciendo en mi carrera Profesional 😊')   
})

test('Create a New Note', async () => {
    const note = {
        content: 'Proximamente sere mas pro en Desarrollo 🥳🤯',
        important: true
    }

    await api
        .post('/api/notes')
        .send(note)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const { notes } = await getAllNotes()
    expect(notes).toHaveLength(initialNotes.length + 1)
    expect(notes).toContain(note.content)    
})

test('Send a new Note empty', async () => {
    const note = {
        important: true
    }

    await api
        .post('/api/notes')
        .send(note)
        .expect(400)

    const { notes } = await getAllNotes()
    expect(notes).toHaveLength(initialNotes.length)
})

test('Delete a Note', async () => {
    const { result: firstResult } = await getAllNotes()
    const { body } = firstResult
    const [ firstNote ] = body

    await api
        .delete(`/api/notes/${ firstNote.id }`)
        .expect(204)

    const { result: secondResult, notes } = await getAllNotes()
    expect(secondResult.body).not.toContain(firstNote.content)
    expect(notes).toHaveLength(initialNotes.length - 1)
})

test('Delete a not exist Note', async () => {
    await api
        .delete(`/api/notes/123123123`)
        .expect(400)

    const { result } = await getAllNotes()
    expect(result.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
    mongoose.connection.close()
    server.close()
})