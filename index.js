//ex 3.1-3.22


require('dotenv').config()
const express = require('express')
const app = express()
const math = require('mathjs')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const mongoose = require('mongoose')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    console.log('catch error......')
    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    next(error)
}


app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :response-time :body'))
app.use(express.static('dist'))
app.use(requestLogger)


morgan.token('body', (res) => { //creating body token
    let bodyTemp = res.body
    console.log(bodyTemp.toString)
    return bodyTemp
})

app.get('/info', (request, response) => {
    console.log(persons.length)
    let date = new Date
    response.send('<h3>Phonebook has info for ' + persons.length + ' people</h3><br/><h3> ' + new Date().toGMTString() + '</h3>  ')
})


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch (error => next(error))
})

const generateId = () => {
    return math.randomInt(10000)
}


app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        {name, number},
        {new: true, runValidators: true, context: 'query'}
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
