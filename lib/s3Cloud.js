
const Cloud = require('./cloud.js');
const Utils = require('./utils');

const path = require('path');


/*

Roadmap...

   Class should abstract away the unique characterists of the AWS S3 api too a generic, digestible api.

   Class should only hold config values which should be immutable after instantiation.

   No client data should be saved to this class, it should have to be retrieved everytime.

   Class should have a few interfaced methods..

   They should use fetch methods as building blocks to build these classes.

   In short, class should have generic get methods that abstract away the differences in the cloud apis.

   Need some way of verifying linux style file paths.. and parsing out pieces of it.


 */
class S3Cloud extends Cloud {

    constructor( credentials ) {
        super( credentials );

        console.log(credentials);
        this.s3 = require('pkgcloud').storage.createClient({

            provider: 'amazon',

            accessKeyId: credentials.accessKey,

            accessKey: credentials.secretAccessKey

        });

    }

    async fetchItem( itemName, destPath ) {
        return new Promise({  })
    }




    //List items from dir context
      fetchItems( srcPath ) {

        let parsedPath = path.parse(srcPath);

        console.log(Utils.getPathType(srcPath));

        if( parsedPath.dir === '/') {

            return new Promise((resolve, reject) => {

                 // do a thing, possibly async, then…
                 this.s3.getContainers(  function (err, containers) {
                     if (err) {
                        reject(Error("It broke"));
                     }

                     // containers.forEach(function (container) {
                     //     console.log(container.toJSON());
                     // });
                     resolve(containers);
                 });
             });
         }
         else {
              return new Promise((resolve, reject) => {
                  // do a thing, possibly async, then…
                  this.s3.getFiles( baseName,  function (err, files) {
                      if (err) {
                          reject(Error("It broke"));
                      }

                      // containers.forEach(function (container) {
                      //     console.log(container.toJSON());
                      // });
                      resolve(files);
                  });
              });
          }



    }




    //Put item with name and data at location
    async putFile( itemName, destPath ) {

    }



    //Make directory at dir contxt
    async putDir( itemName, destPath ) {

    }


    //Move file from source context to dest context
    async moveFile( srcPath, destPath ) {

    }

    async moveDir( srcPath, destPath ) {

    }


    //Should be lambda?
    async migrateFile( srcPath, destClient, destPath ) {

    }

    async migrateDir( srcPath, destClient, destPath ) {

    }

    //Copy file from source context to dest context
    async copyFile( srcPath, destPath ) {

    }


    //Move dir from source context to dest context
    async copyDir( srcPath, destPath) {

    }


    //****DANGER***

    //Remove item with name from context
    async destroyFile( srcPath, itemName) {

    }


    //Remove a directory and its items
    async destroyDir( srcPath, itemName) {

    }
}



module.exports = S3Cloud;