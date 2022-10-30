require('dotenv').config();
const mongoose = require('mongoose');

const URL = process.env.MONGODB_URL;
console.log(URL);

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

mongoose.connect(URL)
  .then(() => {
    console.log('connected with MongoDB..');
    return Person.find({});
  })
  .then(persons => {
    console.log('phonebook:');
    persons.forEach((p) => console.log(p));
    mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  })
  .catch(err => console.log(err.message));