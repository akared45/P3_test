require('dotenv').config();

const mongooseConfig = require('./nosql/mongoose_config');
const MongoUserRepository = require('./nosql/repositories/MongoUserRepository');
const MongoUserSessionRepository = require('./nosql/repositories/MongoUserSessionRepository');
const MongoAppointmentRepository = require('./nosql/repositories/MongoAppointmentRepository');
const MongoSpecializationRepository = require('./nosql/repositories/MongoSpecializationRepository');
const MongoMessageRepository = require('./nosql/repositories/MongoMessageRepository');
const dbType = process.env.DB_TYPE || 'nosql';

const connectDatabase = async () => {
  if (dbType === 'nosql') {
    await mongooseConfig.connect();
  } else {
    console.log('SQL connection not implemented yet');
  }
};
let repositories;

if (dbType === 'nosql') {
  repositories = {
    userRepository: new MongoUserRepository(),
    userSessionRepository: new MongoUserSessionRepository(),
    messageRepository: new MongoMessageRepository(),
    appointmentRepository: new MongoAppointmentRepository(),
    specializationRepository: new MongoSpecializationRepository()
  };
} else {
  repositories = {
    userRepository: null,
    userSessionRepository: null,
  };
}

module.exports = {
  connectDatabase,
  repositories
};