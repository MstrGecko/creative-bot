const rxUsers = require('../helpers/rxUsers');
const { filter } = require('rxjs/operators');
const moment = require('moment');
module.exports = {
  name: 'uptime',
  function: ({ message, streamChannel }) => {
    return new Promise((res, rej) => {
      if (!streamChannel) res('null');
      streamChannel.getUptime().then(seconds => {
        res(`${moment.utc(seconds * 1000).format('hh:mm:ss')}`);
      });
    });
  }
};
