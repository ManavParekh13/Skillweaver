// api/seeder.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // To get our MONGO_URI
const { faker } = require('@faker-js/faker'); // To generate fake data

// Import our models and DB connection
const connectDB = require('./config/db');
const User = require('./models/User');

// --- Helper Data ---
const sampleSkills = [
  'React', 'JavaScript', 'Node.js', 'Python', 'Guitar', 'Piano', 
  'Cooking', 'Baking', 'Photography', 'Graphic Design', 'Spanish', 
  'French', 'Yoga', 'Public Speaking', 'Marketing', 'SEO', 
  'Project Management', 'Data Analysis'
];
const levels = ['Beginner', 'Intermediate', 'Expert'];
const sampleLocations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];

function getRandomSubset(array, size) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * size) + 1);
}

// --- The Main Seeder Function ---
const seedDB = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected for seeding...');

    await User.deleteMany({});
    console.log('Existing users cleared...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    console.log('Hashed password created for all users (password123)');

    // --- THIS IS THE NEW LOGIC ---
    const users = [];
    for (let i = 0; i < 100; i++) {
      
      const skillsToTeach = [];
      const skillNames = getRandomSubset(sampleSkills, 4); 
      
      for (const skillName of skillNames) {
        skillsToTeach.push({
          skill: skillName,
          level: levels[Math.floor(Math.random() * levels.length)]
        });
      }
      
      const user = new User({
        username: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        bio: faker.lorem.paragraph(),
        // --- 2. THIS IS THE CHANGE ---
        location: sampleLocations[Math.floor(Math.random() * sampleLocations.length)],
        // --------------------------
        skillsToTeach: skillsToTeach, 
        skillsToLearn: getRandomSubset(sampleSkills, 3), 
      });
      users.push(user);
    }
    // --- END OF NEW LOGIC ---

    await User.insertMany(users);
    
    console.log('-------------------------');
    console.log('Database successfully seeded with 100 users!');
    console.log('-------------------------');

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected.');
  }
};

seedDB();