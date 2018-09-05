const PkgCloudHerd = require('./PkgCloudHerd.js');


class HpHerd extends PkgCloudHerd {

  constructor(credentials) {
    super(credentials);

    this.cloud = require('pkgcloud').storage.createClient({
      provider: 'hp',
      username: credentials.username,
      apiKey: credentials.apiKey,
      region: credentials.region,
      authUrl: credentials.authUrl,
    });

  }


}


module.exports = HpHerd;
