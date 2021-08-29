const Ajv = require('ajv').default;
const addFormats = require('ajv-formats');
const DEFAULT_OPTIONS = { allErrors: true, strict: false };
const DEFAULT_AJV = new Ajv(DEFAULT_OPTIONS);
addFormats(DEFAULT_AJV);

function compile(schema, options) {
  let ajv = DEFAULT_AJV;
  if (options) {
    ajv = new Ajv({ ...DEFAULT_OPTIONS, ...options });
  }

  return ajv.compile(schema);
}

function validator(schema, options) {
  return compile(schema, options);
}

module.exports = {
  compile,
  validator,
  // validator: require('is-my-json-valid'),
};
