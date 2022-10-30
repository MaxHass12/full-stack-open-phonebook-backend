const mongoose = require('mongoose');
const url = process.env.MONGODB_URL;

const RE = /^(\d{2,3})-(\d+)$/;

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    unique: true,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return v.length > 9 && RE.test(v);
      },
      message: () => 'Not a valid phone number'
    },
    required: true
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});


console.log('starting connection with MongoDB..');

mongoose.connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log(`error connecting to MongoDB: ${err.message}`));

module.exports = new mongoose.model('Person', personSchema);