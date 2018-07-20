const PkgCloudHerd = require('./PkgCloudHerd.js');


class S3Herd extends PkgCloudHerd {

  constructor(credentials) {
    super(credentials);

    this.cloud = require('pkgcloud').storage.createClient({
      provider: 'rackspace',
      accessKeyId: credentials.accessKey,
      accessKey: credentials.secretAccessKey,
    });

  }


}


module.exports = S3Herd;
