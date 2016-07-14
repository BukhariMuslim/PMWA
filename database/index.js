var dbconfig = require('./knexfile');

module.exports = require('knex')(dbconfig.development);