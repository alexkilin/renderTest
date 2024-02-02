// const http = require('http')
//

const express = require('express')
const app = express()
const math = require('mathjs')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :response-time :body'))


let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]



morgan.token('body', (res) => { //creating body token
let bodyTemp=res.body
console.log(bodyTemp.toString)
return bodyTemp
})

app.get('/info', (request, response) => {
console.log(persons.length)
let date = new Date
  response.send('<h3>Phonebook has info for ' + persons.length + ' people</h3><br/><h3> ' + new Date().toGMTString() + '</h3>  ')
})

// app.get('/api/notes', (request, response) => {
//   response.json(notes)
// })

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// app.get('/api/notes/:id', (request, response) => {
//   const id =Number(request.params.id)
//   console.log(id)
//   const note = notes.find(note => note.id === id)
//   if (note) {
//   response.json(note)
// } else {
//   response.status(404).end()
// }
// })

app.get('/api/persons/:id', (request, response) => {
  const id =Number(request.params.id)
  console.log(id)
  const person = persons.find(person => person.id === id)
  if (person) {
  response.json(person)
} else {
  response.status(404).end()
}
})

// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

const generateId = () => {
  return math.randomInt(10000)
}
  app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(request.body)
    if ((!body.name)||(!body.number)) {
      return response.status(400).json({
        error: 'The name or number is missing'
      })
    }

    const isNumberAlreadyExistInPhonebook = (body) => {
      let result=false
      persons.forEach((item, i) => {
        if (item.number == body.number) {
          result = true
        }
      });
      return result
    }

    if (isNumberAlreadyExistInPhonebook(body)) {
      return response.status(400).json({
        error: 'The name already exists in the phonebook'
      })
    }




  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

// app.delete('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   notes = notes.filter(note => note.id !== id)
//
//   response.status(204).end()
// })
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
