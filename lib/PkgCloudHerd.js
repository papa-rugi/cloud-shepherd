const Herd = require('./Herd.js');
const Utils = require('./utils');
const Readable = require('stream').Readable;
const Transform = require('stream').Transform;



/* BIG TO:DOS:
    Do error checking for edge cases.
*/


//Essentially an abstract class
class PkgCloudHerd extends Herd {

    constructor( credentials ) {
        super( credentials );
        this.cloud = null;
    }

    /*
  *
  *
  *  LIST AND STAT
  *
  *  LiMITED to 1,000 files currently. See data markers for more information on 'pagination'
  *
  */
    //List items from dir context
    async ls( srcPath ) {
        let pathType = Utils.getPathType(srcPath);

        if( pathType === 'root') {

            return new Promise((resolve, reject) => {

                // do a thing, possibly async, then…
                this.cloud.getContainers(  function (err, containers) {
                    if (err) {
                        reject(err);
                    }

                    if(typeof containers === 'undefined'){
                        reject('Error, contianers is undefined.');
                    }
                    console.log(containers);

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
                this.cloud.getFiles( container,  function (err, files) {
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
                this.cloud.getFiles( container, options,  function (err, files) {
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
                this.cloud.getFile( container, options.Key,  function (err, file) {
                    if (err) {
                        reject(err);
                    }

                    file = file.name;

                    resolve(file);
                });
            });
        }
        else{
            throw 'Error: Path ' + srcPath + ' could not be determined.'
        }
    }



    async stat( srcPath ) {
        let pathType = Utils.getPathType(srcPath);

        if( pathType === 'root') {

            return new Promise((resolve, reject) => {

                // do a thing, possibly async, then…
                this.cloud.getContainers(  function (err, containers) {
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
                this.cloud.getContainer( container,  function (err, files) {
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
                this.cloud.getFiles( container, options,  function (err, files) {
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
                this.cloud.getFile( container, options.Key,  function (err, file) {
                    if (err) {
                        reject(err);
                    }

                    resolve(file);
                });
            });
        }
        else{
            throw 'Error: Path ' + srcPath + ' could not be determined.'
        }
    }
    /*
  *
  *
  *  MAKE DIRECTORY
  *
  * TODO: Check if dir already exists before creating?
  *
  */
    async mkdir( srcPath ) {

        let pathType = Utils.getPathType(srcPath);

        if( pathType === 'root') {
            throw 'Error: Path of type root (' + srcPath + ') is not a valid mkdir target.'
        }
        else if( pathType === 'rootDir') {

            let container = Utils.parseContainerFromPath(srcPath);

            return new Promise( (resolve, reject) => {
                // do a thing, possibly async, then…
                this.cloud.createContainer( container,  function (err, data) {
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
                let writeStream = this.cloud.upload({
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
        else if( pathType === 'file') {
            throw 'Error: Path of type file: \'' + srcPath + '\' is not a valid mkdir target.'
        }
        else{
            throw 'Error: Path ' + srcPath + ' could not be determined.'
        }
    }

    /*
   *
   *
   *  UPLOAD AND DOWNLOAD
   *
   *
   *
   */

    //Put item with name and data at location
    async uploadFile( destPath, readStream ) {

        let pathType = Utils.getPathType(destPath);

        if (pathType === 'root') {
            throw 'Error: Path ' + destPath + ' is not a valid upload target. Root';
        }
        else if (pathType === 'rootDir') {
            throw 'Error: Path ' + destPath + ' is not a valid upload target. RootDir';
        }
        else if (pathType === 'dir') {
            throw 'Error: Path ' + destPath + ' is not a valid upload target. Dir';
        }
        else if (pathType === 'file') {
            let container = Utils.parseContainerFromPath(destPath);
            let filePath = Utils.removeRootDirFromPath(destPath);

            return new Promise((resolve, reject) => {
                try{
                    let writeStream = this.cloud.upload({
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
                }catch(err){
                    reject(err);
                }
            });
        }
        else{
            throw 'Error: Path ' + srcPath + ' could not be determined.'
        }

    }

    async downloadFile( srcPath, writeStream ) {

        if(writeStream.writable !== true) {
            throw 'Error: Supplied writeStream object is not writable.';
        }

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
                try{

                    let readStream = this.cloud.download({
                        container: container,
                        remote: filePath
                    });

                    readStream.pipe(writeStream);
                    resolve('Download started! File: ' + filePath);

                }catch(err){
                    reject(err);
                }
            });
        }
        else{
            throw 'Error: Path ' + srcPath + ' could not be determined.'
        }
    }

    /*
     *
     *
     *  DELETE
     *
     *
     *
     */

    async delete( srcPath ) {

        let pathType = Utils.getPathType(srcPath);

        if (pathType === 'root') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete file target.';
        }
        else if (pathType === 'rootDir') {
            let container = Utils.parseContainerFromPath(srcPath);
            let filePath = Utils.removeRootDirFromPath(srcPath);

            console.log('delete->rootDir');
            //This should be changed to do a check on whether or not the file exists. Data var just returns false.
            return new Promise((resolve, reject) => {
                this.cloud.destroyContainer(container, (err, data)=>{
                    if (err) {
                        reject(err);
                    }

                    resolve('Root directory: ' + container + ' destroyed');
                });
            });
        }
        else if (pathType === 'dir') {

            let container = Utils.parseContainerFromPath(srcPath);
            let filePath = Utils.removeRootDirFromPath(srcPath);

            //This should be changed to do a check on whether or not the file exists. Data var just returns false.
            return new Promise((resolve, reject) => {
                this.cloud.removeFile(container, filePath,(err, data)=>{
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
                this.cloud.removeFile(container, filePath,(err, data)=>{
                    if (err) {
                        reject(err);
                    }

                    resolve('File destroyed');
                });

            });
        }
        else{
            throw 'Error: Path ' + srcPath + ' could not be determined.'
        }
    }

    //Remove a directory and its items
    async deleteDir( srcPath ) {

        let pathType = Utils.getPathType(srcPath);

        if (pathType === 'root') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete dir target.';
        }
        else if (pathType === 'rootDir') {
            let container = Utils.parseContainerFromPath(srcPath);
            let filePath = Utils.removeRootDirFromPath(srcPath);

            let delList = await this.ls(srcPath);

            if(delList.length === 0){
                return new Promise((resolve, reject) => {
                    this.cloud.destroyContainer(container, (err, data) => {
                        if (err) {
                            reject(err);
                        }

                        resolve('Root directory at path: ' + srcPath + ' destroyed');
                    });
                });
            }

            //Could this be turned into a emptyDirectory function for better composition? Yes, yes it could.
            await Promise.all(delList.map( (file) => {
                return this.delete('/' + container + '/' + file);
            }));

            return new Promise((resolve, reject) => {
                this.cloud.destroyContainer(container, (err, data) => {
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
            let delList = await this.ls(srcPath);

            delList.map( (file) => {
                let fileToDestroy = '/' + container + '/' + file;
                return this.delete(fileToDestroy);
            });

            return await Promise.all(delList);
        }
        else if (pathType === 'file') {
            throw 'Error: Path ' + srcPath + ' is not a valid delete dir target.';
        }
        else{
            throw 'Error: Path ' + srcPath + ' could not be determined.'
        }
    }

    //Remove item with name from context
    async deleteFile( srcPath ) {
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
                this.cloud.removeFile(container, filePath,(err, data)=>{
                    if (err) {
                        reject(err);
                    }

                    resolve('File destroyed');
                });

            });
        }
        else{
            throw 'Error: Path ' + srcPath + ' could not be determined.'
        }
    }




    /*
     *
     *
     *  EXISTS
     *
     *
     *
     */
    async itemExists( srcPath ) {

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
            this.cloud.getFiles( container, options.Key,  function (err, file) {
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
            this.cloud.getFile( container, options.Key,  function (err, file) {
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



    /*
     *
     *
     *  COPY
     *
     *
     *
     */
    async copy(){

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

        await this.downloadFile( srcPath, transformStream);
        await this.uploadFile( destPath, transformStream);

        if(!this.fileExists(destPath)) {
            throw 'Error: File ' + destPath + 'was not copied.';
        }else{
            return true;
        }
    }

    //Copy dir from source context to dest context, all files will be overwritten
    async copyDir( srcPath, destPath) {
        try{
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
                await this.mkdir(pathIntent);
                return true;
            }else {
                contentsOfDir.map(file =>{
                    srcFilePath = '/' + container + '/' + file;
                    destFilePath = destPath + file;
                    return this.copyFile(srcFilePath, destFilePath);
                });

                await Promise.all(contentsOfDir);

                return true;
            }

            throw 'Error: Failure to copy directory';
        }catch (e) {
            console.log(e);
        }
    }

    /*
     *
     *
     *  MOVE
     *
     *
     *
     */
    async move(){

    }

    //Move file from source context to dest context
    async moveFile( srcPath, destPath ) {
        try{
            await this.copyFile(srcPath,destPath);
            await this.deleteFile(srcPath);
            return true;
        }catch (e) {
            console.log(e);
        }
    }

    async moveDir( srcPath, destPath ) {
        try{
            await this.copyDir(srcPath,destPath);
            await this.deleteDir(srcPath);
            return true;
        }catch (e) {
            console.log(e);
        }
    }


    /*
     *
     *
     *  MIGRATE
     *
     *
     *
     */
    async migrate(){

    }

    //Should be lambda?
    async migrateFile( srcPath, destClient, destPath ) {
        let srcPathType = Utils.getPathType(srcPath);
        let destPathType = Utils.getPathType(destPath);

        if(srcPathType !== 'file') {
            throw 'Error: Source path ' + srcPath + 'is not a valid source path for migrate file function.';
        }

        if(destPathType !== 'file') {
            throw 'Error: Destination path ' + destPath + ' is not a valid destination path for migrate file function.';
        }

        const transformStream = Transform({objectMode: true});

        transformStream._transform = function(chunk, encoding, callback) {
            this.push(chunk);
            callback();
        };

        await this.downloadFile( srcPath, transformStream);
        await destClient.uploadFile( destPath, transformStream);
    }

    async migrateDir( srcPath, destClient, destPath ) {
        let srcPathType = Utils.getPathType(srcPath);
        let destPathType = Utils.getPathType(destPath);

        if(srcPathType !== 'dir' && srcPathType !== 'rootDir') {
            throw 'Error: Source path ' + srcPath + 'is not a valid source path for migrate dir function.';
        }

        if(destPathType !== 'dir' && destPathType !== 'rootDir') {
            throw 'Error: Destination path ' + destPath + ' is not a valid destination path for migrate dir function.';
        }

        const transformStream = Transform({objectMode: true});

        transformStream._transform = function(chunk, encoding, callback) {
            this.push(chunk);
            callback();
        };

        let contentsOfDir = await this.ls(srcPath);
        let container = Utils.parseContainerFromPath(srcPath);
        let pathIntent = destPath + Utils.removeRootDirFromPath(srcPath);
        let srcFilePath = '';
        let destFilePath = '';

        if(contentsOfDir.length === 1){
            await this.mkdir(pathIntent);
            return true;
        }else {
            contentsOfDir.map(file =>{
                srcFilePath = '/' + container + '/' + file;
                destFilePath = destPath + file;
                return new Promise((resolve, reject)=>{
                    this.downloadFile( srcFilePath, transformStream);
                    destClient.uploadFile( destFilePath, transformStream);
                    resolve(true);
                });
            });

            await Promise.all(contentsOfDir);

            return true;
        }
    }

}



module.exports = PkgCloudHerd;