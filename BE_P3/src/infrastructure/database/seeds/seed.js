require('dotenv').config();
const { mongoose, connect } = require('../nosql/mongoose_config');

const {
  specializations,
  medications,
  userSeeds,
  appointmentSeeds,
  notificationSeeds,
  userSessions,
  messageSeeds
} = require('./seed_data');

async function seed() {
  try {
    await connect();
    const db = mongoose.connection.db;
    console.log('Seeding database:', db.databaseName);
    const seeds = [
      { name: 'specializations', docs: specializations },
      { name: 'medications', docs: medications },
      { name: 'users', docs: userSeeds() },
      { name: 'appointments', docs: appointmentSeeds },
      { name: 'messages', docs: messageSeeds },
      { name: 'notifications', docs: notificationSeeds },
      { name: 'usersessions', docs: userSessions },
    ];

    for (const { name, docs } of seeds) {
      await seedIfEmpty(db, name, docs);
    }

    console.log("All seed completed!");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.connection.close();
  }
}

async function seedIfEmpty(db, collection, docs) {
  if (!docs || docs.length === 0) {
    console.log(`No data for ${collection}, skipped.`);
    return;
  }
  const count = await db.collection(collection).countDocuments();
  if (count === 0) {
    await db.collection(collection).insertMany(docs);
    console.log(`Inserted ${docs.length} documents into ${collection}`);
  } else {
    console.log(`${collection} already has data. Skipped.`);
  }
}

seed();
