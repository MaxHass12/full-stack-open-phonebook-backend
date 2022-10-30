require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

// helper functions

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// middleware
morgan.token('body', req => JSON.stringify(req.body));

app.use(express.static('build'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());


// routes

app.get('/info', (request, response, next) => {
  Person.find({})
    .then(persons => {
      const date = new Date();
      const msg = `<p>We have ${persons.length} contacts in databse</p>
                       <p>${date}</p>`;
      response.send(msg);
    })
    .catch(error => next(error));
});

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(note => response.json(note))
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error));
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => response.status(400).send(error.message));

});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error));
});

// error handler
const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
// 404 and error-handling
app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.port || 3001;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
