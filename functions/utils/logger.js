module.exports = (!process.env.FIREBASE_CONFIG || process.env.FUNCTIONS_EMULATOR) ? (() => {
  const log4js = require('log4js');
  log4js.configure({
    appenders: {
      normal: {
        type: 'console',
        layout: { type: 'pattern', pattern: '%[[%d{yyyy/MM/dd hh.mm.ss}] [%p] %f{1}:%l:%o%] %m' },
      },
      callStack: {
        type: 'console',
        layout: { type: 'pattern', pattern: '%[[%d{yyyy/MM/dd hh.mm.ss}] [%p] %f{1}%] %m %n%s' },
      },
      debug: {
        type: 'logLevelFilter',
        level: 'debug',
        maxLevel: 'warn',
        appender: 'normal',
      },
      error: {
        type: 'logLevelFilter',
        level: 'error',
        appender: 'callStack',
      }
    },
    categories: {
      default: {
        appenders: ['debug', 'error'],
        level: 'debug',
        enableCallStack: true,
      }
    },
  });
  return log4js.getLogger();
})() : (() => {
  const { logger } = require('firebase-functions');
  return logger;
})();
