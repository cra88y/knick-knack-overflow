'use strict';
const { datatype } = require('faker');
var faker = require('faker');


module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    
    return queryInterface.bulkInsert('Users', [
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      },
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: datatype.number().toString(2),
        hashedPassword: datatype.number().toString(2),
        createdAt: datatype.datetime(),
        updatedAt: datatype.datetime()

      }
      
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
      return queryInterface.bulkDelete('Users', null, {});

  }
};
