//This module should faciliate a wide number of cloud to cloud interactions.
//Each class should have a standardised array of methods to facilitate this, inherited from base cloud class. (Need to
// figure out interfaces)



//In order of dependancy.


exports.cloud = require("./cloud");


exports.s3Cloud = require("./s3Cloud");


exports.cloudFactory = require("./cloudFactory");