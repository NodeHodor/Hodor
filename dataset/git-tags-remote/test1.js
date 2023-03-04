const gtr = require('git-tags-remote');

const https = 'https://github.com/sh0ji/focus-rover.git';
const invalid = 'github.com/sh0ji/focus-rover';


gtr.get(https);
gtr.latest(https);
