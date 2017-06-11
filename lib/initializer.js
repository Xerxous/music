import modules from './modules';
import colors from 'colors';

const initializer = function(commandPrefix) {
  let library = {}
  for (let key in modules) {
    library[key] = {}
    library[key].module = require(`${modules[key]}/${key}`);
    library[key].listens = require(`${modules[key]}/listens`);
    console.log('DEBUGGING for overlapping REGEX: detected by order'.yellow);
    let commands = Object.keys(library[key].listens);
    console.log(`Module: ${key}`.green);
    for (let command in commands) {
      console.log(`\t${commandPrefix} ${commands[command]}`.green);
    }
  }
  return library;
}

export default initializer;
