const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const morgan = require('morgan');
const finishHandler = require('./finishHandler.js');
const { getAPIDefinition } = require('../../config.js');

module.exports = (whitelist, definitionFileName) => {
  const app = express();

  app.use(cors({ origin: true }));

  app.use(express.json({ type: 'application/*+json' }));
  app.use(express.urlencoded({ extended: false }));

  app.use(morgan(':remote-addr - :date[iso] [:method]:url :status :res[content-length] :response-time ms'));
  app.use(finishHandler);

  if (definitionFileName) {
    const definition = getAPIDefinition(definitionFileName);
    if (definition) {
      app.use('/docs', swaggerUI.serveFiles(definition), swaggerUI.setup(definition));
    }
  }

  return app;
};
