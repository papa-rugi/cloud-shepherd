/*  This module should faciliate a wide number of cloud to cloud interactions.
  Each class should have a standardised array of methods to facilitate this, inherited from base cloud class.
  (Need to figure out interfaces) */

exports.cloud = require('./cloud');

exports.s3Cloud = require('./s3Cloud');

exports.herd = function (type, credentials) {
        switch (type) {
            case 's3': return new exports.s3Cloud(credentials);
                break;
        }
};

