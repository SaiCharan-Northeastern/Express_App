const controllers = {};

controllers.Users = require('./userscontroller');

const StatsD = require('node-statsd');
const statsd = new StatsD({ host: "localhost", port: 8125 });

module.exports = statsd;

