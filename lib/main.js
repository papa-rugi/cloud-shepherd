/*  This module should faciliate a wide number of cloud to cloud interactions.
  Each class should have a standardised array of methods to facilitate this, inherited from base cloud class.
  (Need to figure out interfaces) */


exports.S3Herd = require('./S3Herd.js');
exports.RackspaceHerd = require('./RackspaceHerd.js');


exports.herd = function(type, credentials) {
  switch (type) {
    case 's3': return new exports.S3Herd(credentials);
    case 'rackspace': return new exports.RackspaceHerd(credentials);
  }
};

