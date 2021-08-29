const { capitalize } = require('../../utils/helper.js');

module.exports = ({ root, paths, schemas, tags = [] }) => ({
  openapi: '3.0.0',
  info: {
    title: `${capitalize(root)} API`,
    version: 'v1'
  },
  servers: [
    {
      url: `https://asia-east2-dicom-viewer-dac76.cloudfunctions.net/${root}`,
      description: ''
    },
    {
      url: `http://localhost:5000/dicom-viewer-dac76/asia-east2/${root}`,
      description: ''
    }
  ],
  paths: paths,
  components: {
    securitySchemes: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      },
    },
    schemas,
  },
  security: [
    {
      JWT: [],
    },
  ],
  tags,
});
