const PkgCloudHerd = require('./PkgCloudHerd.js');


class OpenstackHerd extends PkgCloudHerd {

  constructor(credentials) {
    super(credentials);

    this.cloud = require('pkgcloud').storage.createClient({
      provider: 'openstack',
      username: credentials.username,
      password: credentials.password,
      authUrl: credentials.authUrl,
    });
  }
}


module.exports = OpenstackHerd;
