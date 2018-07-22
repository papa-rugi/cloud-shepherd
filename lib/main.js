

exports.S3Herd = require('./S3Herd.js');
exports.RackspaceHerd = require('./RackspaceHerd.js');
exports.AzureHerd = require('./AzureHerd.js');
exports.HpHerd = require('./HpHerd.js');
exports.OpenstackHerd = require('./OpenstackHerd.js');



exports.herd = function(type, credentials) {
  switch (type) {
    case 's3': return new exports.S3Herd(credentials);
    case 'rackspace': return new exports.RackspaceHerd(credentials);
    case 'azure': return new exports.AzureHerd(credentials);
    case 'hp': return new exports.HpHerd(credentials);
    case 'openstack': return new exports.OpenstackHerd(credentials);
  }
};

