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
    return queryInterface.bulkInsert('Questions', [{
      userId: 4,
      content: 'random nonesense1',
      title: "I Am A Title",
      createdAt: datatype.datetime(),
      updatedAt: datatype.datetime()      
    },
    {
      userId: 6,
      content: 'random nonesaaaense1',
      title: "I Aasdfdsm A Title",
      createdAt: datatype.datetime(),
      updatedAt: datatype.datetime()      
    },
    {
      userId: 7,
      content: 'random nddddonesense1',
      title: "I Am Asadfsafd Title",
      createdAt: datatype.datetime(),
      updatedAt: datatype.datetime()      
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Questions', null, {});

  }
};
