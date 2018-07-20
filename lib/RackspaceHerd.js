const PkgCloudHerd = require('./PkgCloudHerd.js');


class RackspaceHerd extends PkgCloudHerd {

  constructor(credentials) {
    super(credentials);

    this.cloud = require('pkgcloud').storage.createClient({
      provider: 'rackspace',
      username: credentials.username,
      apiKey: credentials.apiKey,
      service: credentials.service,
      region: credentials.region,
    });

    console.log(this.cloud);
  }


}


module.exports = RackspaceHerd;
