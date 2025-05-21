// Mongoose Checkpoint Solution
// This file demonstrates CRUD operations using Mongoose and MongoDB Atlas
// Don't forget to set your MONGO_URI in the .env file!
//
// 1. Install dependencies: npm install
// 2. Set your MongoDB Atlas URI in .env as MONGO_URI
// 3. Run: node mongoose-checkpoint.js
//
// Each operation is commented for clarity and matches the checkpoint requirements.

require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB Atlas using Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB Atlas!');
});

// Define the Person schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

// Create the Person model
const Person = mongoose.model('Person', personSchema);

// Create and save a single person
const person = new Person({
  name: 'John',
  age: 25,
  favoriteFoods: ['pizza', 'pasta']
});
person.save(function(err, data) {
  if (err) return console.error(err);
  console.log('Single person saved:', data);

  // Create many people
  const arrayOfPeople = [
    { name: 'Mary', age: 30, favoriteFoods: ['burritos', 'salad'] },
    { name: 'Ahmed', age: 22, favoriteFoods: ['burritos', 'falafel'] },
    { name: 'Sarah', age: 28, favoriteFoods: ['sushi', 'burritos'] }
  ];
  Person.create(arrayOfPeople, function(err, people) {
    if (err) return console.error(err);
    console.log('Multiple people saved:', people);

    // Find all people named 'Mary'
    Person.find({ name: 'Mary' }, function(err, foundPeople) {
      if (err) return console.error(err);
      console.log('People named Mary:', foundPeople);

      // Find one person who likes burritos
      Person.findOne({ favoriteFoods: 'burritos' }, function(err, foundOne) {
        if (err) return console.error(err);
        console.log('One person who likes burritos:', foundOne);

        // Find by ID
        Person.findById(people[0]._id, function(err, foundById) {
          if (err) return console.error(err);
          console.log('Person found by ID:', foundById);

          // Classic update: add hamburger to favoriteFoods
          Person.findById(foundById._id, function(err, personToUpdate) {
            if (err) return console.error(err);
            personToUpdate.favoriteFoods.push('hamburger');
            personToUpdate.save(function(err, updatedPerson) {
              if (err) return console.error(err);
              console.log('Updated favoriteFoods:', updatedPerson);

              // New update: set age to 20 for a person named Ahmed
              Person.findOneAndUpdate(
                { name: 'Ahmed' },
                { age: 20 },
                { new: true },
                function(err, updatedDoc) {
                  if (err) return console.error(err);
                  console.log('Ahmed age updated:', updatedDoc);

                  // Delete by ID
                  Person.findByIdAndRemove(people[1]._id, function(err, removedDoc) {
                    if (err) return console.error(err);
                    console.log('Removed by ID:', removedDoc);

                    // Delete all people named Mary
                    Person.remove({ name: 'Mary' }, function(err, result) {
                      if (err) return console.error(err);
                      console.log('All Marys removed:', result);

                      // Chain search: people who like burritos, sort by name, limit 2, hide age
                      Person.find({ favoriteFoods: 'burritos' })
                        .sort('name')
                        .limit(2)
                        .select('-age')
                        .exec(function(err, data) {
                          if (err) return console.error(err);
                          console.log('People who like burritos (sorted, limited, no age):', data);
                          mongoose.connection.close();
                        });
                    });
                  });
                }
              );
            });
          });
        });
      });
    });
  });
});
