const { format, createLogger, transports  } = require('winston');
const path = require('path');
const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
      ),
  transports: [
    new transports.File({
    filename: path.join('./logs', 'webApp.log')
    })
  ]
  });
  
module.exports = logger ;