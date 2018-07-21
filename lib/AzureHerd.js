const PkgCloudHerd = require('./PkgCloudHerd.js');


class AzureHerd extends PkgCloudHerd {

  constructor(credentials) {
    super(credentials);

    this.cloud = require('pkgcloud').storage.createClient({
      provider: 'azure',
      storageAccount: credentials.storageAccount,
      storageAccessKey: credentials.storageAccessKey,
    });

    console.log(this.cloud);

  }


}


module.exports = AzureHerd;
