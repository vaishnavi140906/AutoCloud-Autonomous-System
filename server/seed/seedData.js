const dotenv = require('dotenv');
dotenv.config();
const { connectDB, disconnectDB } = require('../config/db');
const { seedInitialData } = require('./initialData');

const runSeed = async () => {
  try {
    await connectDB();
    await seedInitialData();
    console.log('🎉 Seed completed successfully!');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
