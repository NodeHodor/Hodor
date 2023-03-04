// const chalk = require('chalk');
const family = [
    {"fname": "Mike", "lname": "Erickson", "gender": "Male", "role": "Parent", "kids": "yes"},
    {"fname": "Kira", "lname": "Erickson", "gender": "Female", "role": "Parent", "kids": "yes"},
    {"fname": "Joelle", "lname": "Erickson (Asoau)", "gender": "Female", "role": "Child", "kids": "yes"},
    {"fname": "Brady", "lname": "Erickson", "gender": "Male", "role": "Child", "kids": "no"},
    {"fname": "Bailey", "lname": "Erickson", "gender": "Female", "role": "Child", "kids": "no"},
    {"fname": "Trevor", "lname": "Erickson", "gender": "Male", "role": "Child", "kids": "no"}
];
  

let msg = require('cd-messenger');

// console.log(
//   chalk.green.cyan(msg.name() + ' Version: ' + chalk.green.bold(msg.version()))
// );

msg.note('Node Messenger: Note', ['mike', 'kira']);
// msg.log(chalk.green.bold('Node Messenger: Log'));
msg.info('Node Messenger: Info', ['mike', 'kira']);
msg.success('Node Messenger: Success');
msg.warning('Node Messenger: Warning');
msg.error('Node Messenger: Error');

msg.line('green');
msg.line('red');
msg.line('cyan');
msg.line('magenta');
msg.line('purple');
msg.line('blue');

msg.dir(family);
msg.line('blue');

msg.table(family);
msg.line('blue');

msg.table([
  ['fname', 'lname', 'role'],
  ['Mike', 'Erickson', 'Parent'],
  ['Kira', 'Erickson', 'Parent'],
  ['Joelle', 'Erickson (Asoau)', 'Child'],
  ['Brady', 'Erickson', 'Child'],
  ['Bailey', 'Erickson', 'Child'],
  ['Trevor', 'Erickson', 'Child'],
]);
