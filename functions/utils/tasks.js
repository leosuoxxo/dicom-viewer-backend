const consumeTasks = tasks => {
  return Promise.all(Object.values(tasks)).then(results => {
    results.forEach((result, i) => {
      tasks[Object.keys(tasks)[i]] = result;
    });
    return tasks;
  });
};

const validateTasks = (tasks, whitelist = []) => {
  for (let [err] of Object.values(tasks)) {
    if (err && !whitelist.includes(err)) {
      return err;
    }
  }
  return null;
};

module.exports = {
  validateTasks,
  consumeTasks
};