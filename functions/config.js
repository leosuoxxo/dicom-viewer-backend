function getAPIDefinition(definitionFileName) {
  const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG);
  const definition = require(`./routes/definitions/${definitionFileName}`);
  if (definition) {
    definition.servers.forEach(server => {
      server.url = server.url.replace('{PROJECT_ID}', projectId);
      server.description = server.description.replace('{PROJECT_ID}', projectId);
    });
  }
  return definition;
}


module.exports = {
  getAPIDefinition,
};
