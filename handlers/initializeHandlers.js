const createUserHandler = require('./createUserHandler');
const getUserListHandler = require('./getUserListHandler');
const getUserHandler = require('./getUserHandler');
const updateUserHandler = require('./updateUserHandler');
const deleteUserHandler = require('./deleteUserHandler');
const loginHandler = require('./loginHandler');

const initializeHandlers = (context) => ({
  createUserHandler: createUserHandler(context),
  getUserListHandler: getUserListHandler(context),
  getUserHandler: getUserHandler(context),
  updateUserHandler: updateUserHandler(context),
  deleteUserHandler: deleteUserHandler(context),
  loginHandler: loginHandler(context)
});

module.exports = initializeHandlers;
