'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * 
    */
    await queryInterface.bulkInsert('User',
      [
        {
          username: 'fake 1',
          email: 'helo@gmail.com',
          password: "12345",
        },
        {
          username: 'fake 2',
          email: 'helo@gmail.com',
          password: "12345",
        },
        {
          username: 'fake 3',
          email: 'helo@gmail.com',
          password: "12345",
        },

      ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
