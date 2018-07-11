
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

        this.s3 = require('pkgcloud').storage.createClient({

            provider: 'amazon',

            accessKeyId: credentials.accessKey,

            accessKey: credentials.secretAccessKey

        });

    }


    //List items from dir context
    fetchItems( srcPath ) {

        let pathType = Utils.getPathType(srcPath);



        if( pathType === 'root') {

            return new Promise((resolve, reject) => {

                 // do a thing, possibly async, then…
                 this.s3.getContainers(  function (err, containers) {
                     if (err) {
                        reject(err);
                     }
                     
                     resolve(containers);
                 });
             });
         }
         else if( pathType === 'rootDir') {

            let container = Utils.parseContainerFromPath(srcPath);

            return new Promise((resolve, reject) => {
                  // do a thing, possibly async, then…
                  this.s3.getFiles( container,  function (err, files) {
                      if (err) {
                          reject(err);
                      }

                      resolve(files);
                  });
              });
        }
        else if( pathType === 'dir') {

            let container = Utils.parseContainerFromPath(srcPath);
            let dir = Utils.parseDirFromPath(srcPath);

            let options = {
                prefix: dir
            };

            return new Promise((resolve, reject) => {
                // do a thing, possibly async, then…
                this.s3.getFiles( container, options,  function (err, files) {
                    if (err) {
                        reject(err);
                    }

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