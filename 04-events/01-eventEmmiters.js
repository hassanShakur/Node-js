const EventEmmiter = require('events');

class Project extends EventEmmiter {
  constructor() {
    super();
  }
}

const myEmmiter = new Project();

myEmmiter.on('newProject', () => {
  console.log('Start of a new project');
});

// Several liteners can be set on the same event
myEmmiter.on('newProject', (type) => {
  console.log(`The project is on ${type}`);
});

myEmmiter.emit('newProject', 'Computer Science');
