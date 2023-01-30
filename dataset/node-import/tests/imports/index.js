/* Importing Teams */
'@import people/michael';
'@import people/smith';
'@import people/william';

var x = function() {
    '@import people/michael';
}

/* Showing Michael */
console.log(('\nIt should be display profile of Michael with age overriden by William'));
michael.profile();

/* Showing Smith */
console.log(('\nIt should be display profile of Smith with age overriden by William'));
smith.profile();

/* Showing William */
console.log(('\nIt should be display profile of William'));
william.profile();

/* Getting Variables from namespaces */
console.log(('\nIt should be display ages of Michael'));
console.log(michael.age);

console.log(('\nIt should be display ages of Smith'));
console.log(smith.age);

console.log(('\nIt should be display ages of William'));
console.log(william.age);

/* Getting Globa Variables */
console.log(('\nIt should be display "foo" from Michael'));
console.log(foo);

console.log(('\nIt should be display "bar" from Smith'));
console.log(bar);

console.log(('\nIt should be display "foobar" from William'));
console.log(foobar);