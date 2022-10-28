const express = require('express');
const app = express();

app.use(express.json());

const PORT = 3001;
const ONE_MILLION = 1000000;

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
];

const generateId = () => {
  return Math.floor(Math.random() * ONE_MILLION);
}

app.get('/info', (request, response) => {
  const info = `<p>Phonebook has info for ${persons.length} people</p>`;
  const date = `<p>${new Date()}</>`
  response.send(info + date);
})

app.get('/api/persons', (request, response) => {
  response.send(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(p => p.id === id);
  
  if (!person) {
    response.status(404).end();
  } else {
    response.json(person);
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(p => p.id !== id);

  response.status(204).end();
})

app.post('/api/persons', (request, response) => {
  const body = request.body;

  // input validation
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    });
  } else if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  const newPerson = {id: generateId(), ...body};
  persons = persons.concat(newPerson);

  response.json(newPerson);
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
