const PkgCloudHerd = require('./PkgCloudHerd.js');


class AzureHerd extends PkgCloudHerd {

  constructor(credentials) {
    super(credentials);

    this.cloud = require('pkgcloud').storage.createClient({
      provider: 'azure',
      storageAccount: 'shepherdtester',
      storageAccessKey: 'NX/vFSw5OazwGWktmBnYYyeordMTPsK3rA8T3LuUhUm5ogI+ofaTrpgjJHK12ycC6twNfd9W86a2sEG5DsltiA==',
    });

    console.log(this.cloud);

  }


}


module.exports = AzureHerd;
