
const Cloud = require('./cloud.js');
const Utils = require('./utils');
const fs = require('fs');
const Readable = require('stream').Readable;
const Writable = require('stream').Writable;
const Transform = require('stream').Transform;


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

                     let contents = containers.map( container => {
                         return container.name;
                     });

                     resolve(contents);
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

                      let contents = files.map( file => {
                          return file.name;
                      });

                      resolve(contents);
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

                    let contents = files.map( file => {
                        return file.name;
                    });

                    resolve(contents);
                });
            });
        }
        else if( pathType === 'file') {

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
                this.s3.getFile( container, options.Key,  function (err, file) {
                    if (err) {
                        reject(err);
                    }

                    file = file.name;

                    resolve(file);
                });
            });
        }
    }

    async stat( srcPath ) {
        let pathType = Utils.getPathType(srcPath);

        if( pathType === 'root') {

            return new Promise((resolve, reject) => {

                // do a thing, possibly async, then…
                this.s3.getContainers(  function (err, containers) {
                    if (err) {
                        reject(err);
                    }
                    // console.log('in stat', containers);
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
        else if( pathType === 'file') {

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
                this.s3.getFile( container, options.Key,  function (err, file) {
                    if (err) {
                        reject(err);
                    }

                    resolve(file);
                });
            });
        }
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

    //Remove item with name from context
    async destroyFile( srcPath ) {
        console.log('In a promise'+ srcPath);

        let pathType = Utils.getPathType(srcPath);

        if (pathType === 'root') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete file target.';
        }
        else if (pathType === 'rootDir') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete file target.';
        }
        else if (pathType === 'dir') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete file target.';
        }
        else if (pathType === 'file') {

            let container = Utils.parseContainerFromPath(srcPath);
            let filePath = Utils.removeRootDirFromPath(srcPath);

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

    async emptyDir( srcPath ) {

        let pathType = Utils.getPathType(srcPath);

        if (pathType === 'root') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete dir target.';
        }
        else if (pathType === 'rootDir') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete dir target.';
        }
        else if (pathType === 'dir') {
            let container = Utils.parseContainerFromPath(srcPath);
            let delListRaw = await this.ls(srcPath);

            return Promise.all(delListRaw.map( (file) => {
                let fileToDestroy = '/' + container + '/' + file.toJSON().name;

                if(fileToDestroy !== srcPath) {
                    return this.unlink(fileToDestroy);
                }else {
                    return 'Container, not deleted';
                }
            }));
        }
        else if (pathType === 'file') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete dir target.';
        }
    }

    //Remove a directory and its items
    async destroyDir( srcPath ) {

        let pathType = Utils.getPathType(srcPath);

        if (pathType === 'root') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete dir target.';
        }
        else if (pathType === 'rootDir') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete dir target.';
        }
        else if (pathType === 'dir') {
            let container = Utils.parseContainerFromPath(srcPath);
            let filePath = Utils.removeRootDirFromPath(srcPath);
            let delListRaw = await this.ls(srcPath);

            return Promise.all(delListRaw.map( (file) => {
                let fileToDestroy = '/' + container + '/' + file.toJSON().name;

                return this.unlink(fileToDestroy);
            }));
        }
        else if (pathType === 'file') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete dir target.';
        }
    }

    async emptyRootDir( srcPath ) {

        let pathType = Utils.getPathType(srcPath);

        if (pathType === 'root') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete dir target.';
        }
        else if (pathType === 'rootDir') {
            let container = Utils.parseContainerFromPath(srcPath);
            let delListRaw = await this.ls(srcPath);

            return Promise.all(delListRaw.map( (file) => {
                let fileToDestroy = '/' + container + '/' + file.toJSON().name;

                if(fileToDestroy !== srcPath) {
                    return this.unlink(fileToDestroy);
                }else {
                    return 'Root directory not deleted';
                }
            }));
        }
        else if (pathType === 'dir') {
            throw 'Error: Path ' + srcPath + ' is not a valid empty root dir target.'
        }
        else if (pathType === 'file') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete dir target.';
        }
    }

    async destroyRootDir( srcPath ) {

        let pathType = Utils.getPathType(srcPath);

        if (pathType === 'root') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete root dir target.';
        }
        else if (pathType === 'rootDir') {
            let container = Utils.parseContainerFromPath(srcPath);
            let filePath = Utils.removeRootDirFromPath(srcPath);

            let delList = await this.ls(srcPath);

            if(delList.length === 0){
                return new Promise((resolve, reject) => {
                    this.s3.destroyContainer(container, (err, data) => {
                        if (err) {
                            reject(err);
                        }

                        resolve('Root directory destroyed');
                    });
                });
            }

            //Could this be turned into a emptyDirectory function for better composition? Yes, yes it could.
            await Promise.all(delList.map( (file) => {
                return this.unlink('/' + container + '/' + file.toJSON().name);
            }));

            return new Promise((resolve, reject) => {
                this.s3.destroyContainer(container, (err, data) => {
                    if (err) {
                        reject(err);
                    }

                    resolve('Root directory destroyed');
                });
            });
        }
        else if (pathType === 'dir') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete root dir target.'
        }
        else if (pathType === 'file') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete root dir target.';
        }
    }

    async unlink( srcPath ) {

        let pathType = Utils.getPathType(srcPath);

        if (pathType === 'root') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete file target.';
        }
        else if (pathType === 'rootDir') {
            let container = Utils.parseContainerFromPath(srcPath);
            let filePath = Utils.removeRootDirFromPath(srcPath);

            //This should be changed to do a check on whether or not the file exists. Data var just returns false.
            return new Promise((resolve, reject) => {
                this.s3.destroyContainer(container, (err, data)=>{
                    if (err) {
                        reject(err);
                    }

                    resolve('Root directory destroyed');
                });

            });
        }
        else if (pathType === 'dir') {

            let container = Utils.parseContainerFromPath(srcPath);
            let filePath = Utils.removeRootDirFromPath(srcPath);

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
        else if (pathType === 'file') {

            let container = Utils.parseContainerFromPath(srcPath);
            let filePath = Utils.removeRootDirFromPath(srcPath);

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


    async rootDirExists( srcPath ) {
        let pathType = Utils.getPathType(srcPath);

        if( pathType !== 'rootDir' ) {
            throw "Error: Supplied path " + srcPath + " does not resolve to a root level directory.";
        }

        let container = Utils.parseContainerFromPath(srcPath);
        let filePath = Utils.removeRootDirFromPath(srcPath);

        let options = {
            Key: filePath
        };

        return new Promise((resolve, reject) => {
            // do a thing, possibly async, then…
            this.s3.getContainer( container,  function (err, file) {
                if (err) {
                    if(err.code === 'NotFound'){
                        resolve(false);
                    }
                    reject(err);
                }

                resolve(true);
            });
        });
    }

    async dirExists( srcPath ) {
        let pathType = Utils.getPathType(srcPath);

        if( pathType !== 'dir' ) {
            throw "Error: Supplied path " + srcPath + " does not resolve to a directory.";
        }

        let container = Utils.parseContainerFromPath(srcPath);
        let dirPath = Utils.removeRootDirFromPath(srcPath);

        let options = {
            Key: dirPath
        };

        return new Promise((resolve, reject) => {
            // do a thing, possibly async, then…
            this.s3.getFiles( container, options.Key,  function (err, file) {
                if (err) {
                    if(err.code === 'NotFound'){
                        resolve(false);
                    }
                    reject(err);
                }

                resolve(true);
            });
        });
    }

    async fileExists( srcPath ) {
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
            this.s3.getFile( container, options.Key,  function (err, file) {
                if (err) {
                    if(err.code === 'NotFound'){
                        resolve(false);
                    }
                    reject(err);
                }

                resolve(true);
            });
        });
    }

    //Copy file from source context to dest context. Will overwrite any files with similar name
    async copyFile( srcPath, destPath ) {
        let pathType = Utils.getPathType(destPath);

        if(pathType !== 'file') {
            throw 'Error: Source path ' + srcPath + 'is not a valid source path for copyFile function.';
        }

        const transformStream = Transform({objectMode: true});

        transformStream._transform = function(chunk, encoding, callback) {
            this.push(chunk);
            callback();
        };

        console.log('Copying ' + srcPath + ' to ' + destPath);
        await this.downloadFile( srcPath, transformStream);

        await this.uploadFile( destPath, transformStream);

        if(!await this.fileExists(destPath)) {
            throw 'Error: File ' + destPath + 'was not copied.';
        }

        return true;
    }

    //Copy dir from source context to dest context, all files will be overwritten
    async copyDir( srcPath, destPath) {
        let pathType = Utils.getPathType(destPath);

        if(pathType !== 'dir') {
            throw 'Error: Source path ' + srcPath + 'is not a valid source path for copyFile function.';
        }

        if(!await this.dirExists(srcPath)) {
            throw 'Error: Source dir ' + srcPath + 'does not exist.';
        }

        let contentsOfDir = await this.ls(srcPath);
        let container = Utils.parseContainerFromPath(srcPath);
        let pathIntent = destPath + Utils.removeRootDirFromPath(srcPath);
        let srcFilePath = '';
        let destFilePath = '';

        if(contentsOfDir.length === 1){
            return await this.mkdir(pathIntent);
        }else {
            for(let file of contentsOfDir) {
                srcFilePath = '/' + container + '/' + file;
                destFilePath = destPath + file;

                await this.copyFile(srcFilePath, destFilePath);
            }

        }
        //Iterate through files at src path, for each attempt to upload to destpath
        //...
        //PROFIT?!?!
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

}



module.exports = S3Cloud;