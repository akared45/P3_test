const PaymentMethod = require('./PaymentMethod');
const { Action, Resource } = require('./Permission');
module.exports = {
  UserType: require('./UserType'),
  Gender: require('./Gender'),
  ContactType: require('./ContactType'),
  AppointmentType: require('./AppointmentType'),
  AppointmentStatus: require('./AppointmentStatus'),
  NotificationType: require('./NotificationType'),
  MedicalConditionStatus: require('./MedicalConditionStatus'),
  MessageType: require('./MessageType'),
  TokenType: require('./TokenType'),
  PaymentStatus: require('./PaymentStatus'),
  PaymentMethod: require('./PaymentMethod'),
  Action,
  Resource
};