const { v4: uuid } = require('uuid');
const { PATTERN } = require('../constants');
const logger = require('./logger');

function shortId() {
  return uuid().split('-').join('');
}

function convertValidationErrorsToString(errors = []) {
  return errors.reduce((acc, v) => {
    const fieldName = v.field || v.dataPath;
    if (!fieldName) {
      if (v.keyword === 'additionalProperties') {
        acc += `[${v.message}: '${[(v.params || {}).additionalProperty]}']`;
      } else {
        acc += `[${v.message}]`;
      }
    } else {
      acc += `[${v.field || v.dataPath}: ${v.message}]`;
    }
    return acc;
  }, '');
}

function consumeTasks(tasks) {
  return Promise.all(Object.values(tasks)).then(results => {
    results.forEach((result, i) => {
      tasks[Object.keys(tasks)[i]] = result;
    });
    return tasks;
  });
}

function validateTasks(tasks, whitelist = []) {
  for (let [err] of Object.values(tasks)) {
    if (err && !whitelist.includes(err)) {
      return err;
    }
  }
  return null;
}

async function runTasks(tasks, whitelist = []) {
  try {
    console.log('tasks',tasks);
    let results = await consumeTasks(tasks);
    console.log('results',results);
    let err = validateTasks(results, whitelist);
    if (err) {
      return Promise.resolve([err]);
    }

    return Promise.resolve([null, Object.entries(results).reduce((acc, [k, v]) => {
      let taskResult = v.slice(1);
      if (taskResult.length === 0) {
        acc[k] = null;
      } else if (taskResult.length === 1) {
        acc[k] = taskResult[0];
      } else {
        acc[k] = taskResult;
      }
      return acc;
    }, {})]);
  } catch (err) {
    logger.error(`[runTasks] error: ${err}`);
    return Promise.resolve([err]);
  }
}

function paginateArray(arr, skip, limit) {
  return arr.slice(skip || 0, (skip || 0) + (limit || arr.length));
}

function strToInt(number) {
  if (number && RegExp(PATTERN.POSITIVE_NUMBER).test(number)) {
    return parseInt(number);
  }

  return number;
}

function removeUndefinedFromObject(obj) {
  let result = {};
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] !== 'undefined') {
      result[key] = obj[key];
    }
  });

  return result;
}

function strToBool(v) {
  if (v && RegExp(PATTERN.BOOLEAN).test(v)) {
    return JSON.parse(v);
  }

  return v;
}

function isExist(v) {
  return v !== null && v !== '' && typeof v !== 'undefined';
}

async function batchQuery({ ref, fieldName, values, method = 'in' }) {
  if (!values) {
    const snapshots = await ref.get();
    return snapshots.docs;
  }

  let promises = [];
  let remaining = [].concat(values);
  while (remaining.length > 0) {
    promises.push(ref.where(fieldName, method, remaining.splice(0, 10)).get());
  }
  const results = await Promise.all(promises);
  return results.reduce((acc, v) => {
    acc = acc.concat(v.docs);
    return acc;
  }, []);
}

function capitalize(str) {
  if (typeof str !== 'string') return '';
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

function formatURL({ base = '', pathname = '', query = {} }) {
  if (!base) {
    return '';
  }

  const requestURL = pathname ? new URL(pathname, base) : new URL(base);
  if (Object.entries(query).length > 0) {
    requestURL.search = qs.stringify(query, { indices: true, encodeValuesOnly: true });
  }
  return requestURL.toString();
}

module.exports = {
  shortId,
  convertValidationErrorsToString,
  runTasks,
  paginateArray,
  strToInt,
  removeUndefinedFromObject,
  strToBool,
  isExist,
  batchQuery,
  capitalize,
  formatURL,
};
