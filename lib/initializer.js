import modules from './modules';

const initializer = function() {
  let library = {}
  for (let key in modules) {
    library[key] = {}
    library[key].module = require(`${modules[key]}/${key}`);
    library[key].listens = require(`${modules[key]}/listens`)
  }
  return library;
}

export default initializer();
