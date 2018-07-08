


const cloudherder = require('../lib/main.js');

const credentials = require('./credentials');

const source = cloudherder.cloudFactory.issue('s3', credentials);







cloudherder.s3Cloud.test();
