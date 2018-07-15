
const Cloud = require('./cloud.js');
const Utils = require('./utils');
const fs = require('fs');
const Readable = require('readable-stream').Readable;


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
    async ls( srcPath ) {

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
            let dir = Utils.removeRootDirFromPath(srcPath);

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

    async readFile( srcPath ) {

        let pathType = Utils.getPathType(srcPath);

        if( pathType !== 'file' ) {
            throw "Error: Supplied path " + srcPath + " does not resolve to a file.";
        }

        let container = Utils.parseContainerFromPath(srcPath);
        let filePath = Utils.removeRootDirFromPath(srcPath);

        let options = {
            Key: filePath
        };

        return new Promise((resolve, reject) => {
            // do a thing, possibly async, then…
            this.s3.getFile( container, options.Key,  function (err, files) {
                if (err) {
                    reject(err);
                }

                resolve(files);
            });
        });

    }

    async mkdir( srcPath ) {

        let pathType = Utils.getPathType(srcPath);



        if( pathType === 'root') {
            throw 'Error: Path ' + srcPath + ' is not a valid mkdir target.'
        }
        else if( pathType === 'rootDir') {

            let container = Utils.parseContainerFromPath(srcPath);

            return new Promise( (resolve, reject) => {
                // do a thing, possibly async, then…
                this.s3.createContainer( container,  function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });
        }
        else if( pathType === 'dir') {

            let container = Utils.parseContainerFromPath(srcPath);
            let dir = Utils.removeRootDirFromPath(srcPath);

            return new Promise((resolve, reject) => {
                let writeStream = this.s3.upload({
                    container: container,
                    remote: dir
                });

                writeStream.on('finish', () =>{
                    resolve("Directory: " + dir + " Created in Bucket: " + container);
                });

                writeStream.on('error', (Error) =>{
                   reject(Error);
                });

                let readStream = Readable({objectMode: true});
                readStream._read = () => {};
                readStream.push(':)'); //Need to push some data, any data, to create the directory.
                readStream.push(null);
                readStream.pipe(writeStream);
            });
        }
    }

    //Put item with name and data at location
    async uploadFile( destPath, readStream ) {

        let pathType = Utils.getPathType(destPath);

        if (pathType === 'root') {
            throw 'Error: Path ' + destPath + ' is not a valid upload target.';
        }
        else if (pathType === 'rootDir') {
            throw 'Error: Path ' + destPath + ' is not a valid upload target.';
        }
        else if (pathType === 'dir') {
            throw 'Error: Path ' + destPath + ' is not a valid upload target.';
        }
        else if (pathType === 'file') {

            let container = Utils.parseContainerFromPath(destPath);
            let filePath = Utils.removeRootDirFromPath(destPath);

                return new Promise((resolve, reject) => {
                    let writeStream = this.s3.upload({
                        container: container,
                        remote: filePath
                    });

                    writeStream.on('finish', () =>{
                        resolve("File: " + filePath + " Created in Bucket: " + container);
                    });

                    writeStream.on('error', (Error) =>{
                        reject(Error);
                    });

                    readStream.pipe(writeStream);
                });
            }

    }

    async downloadFile( srcPath, writeStream ) {

        let pathType = Utils.getPathType(srcPath);

        if (pathType === 'root') {
            throw 'Error: Path ' + srcPath + ' is not a valid upload target.';
        }
        else if (pathType === 'rootDir') {
            throw 'Error: Path ' + srcPath + ' is not a valid upload target.';
        }
        else if (pathType === 'dir') {
            throw 'Error: Path ' + srcPath + ' is not a valid upload target.';
        }
        else if (pathType === 'file') {

            let container = Utils.parseContainerFromPath(srcPath);
            let filePath = Utils.removeRootDirFromPath(srcPath);

            return new Promise((resolve, reject) => {
                let readStream = this.s3.download({
                    container: container,
                    remote: filePath
                });

                readStream.pipe(writeStream);
            });
        }
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
    async destroyFile( destPath ) {

        let pathType = Utils.getPathType(destPath);

        if (pathType === 'root') {
            throw 'Error: Path ' + destPath + ' is not a valid upload target.';
        }
        else if (pathType === 'rootDir') {
            throw 'Error: Path ' + destPath + ' is not a valid upload target.';
        }
        else if (pathType === 'dir') {
            throw 'Error: Path ' + destPath + ' is not a valid upload target.';
        }
        else if (pathType === 'file') {

            let container = Utils.parseContainerFromPath(destPath);
            let filePath = Utils.removeRootDirFromPath(destPath);

            //This should be changed to do a check on whether or not the file exists. Data var just returns false.
            return new Promise((resolve, reject) => {
                this.s3.removeFile(container, filePath,(err, data)=>{
                    if (err) {
                        reject(err);
                    }

                    resolve('File destroyed');
                });

            });
        }
    }

    //Remove a directory and its items
    async destroyDir( srcPath, itemName) {

    }
}



module.exports = S3Cloud;