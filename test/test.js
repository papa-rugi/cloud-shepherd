
const shepherd = require('../lib/main.js');

const credentials = require('./credentials.js');

const source = shepherd.herd('s3', credentials.amazon);
// const destination = shepherd.herd('s3', credentials.destinationCredentials);


/** **TESTING***/
const path = require('path');
const util = require('../lib/utils.js');
const stream = require('stream');
const Readable = require('stream').Readable;

source.mkdir('/test-test-test-test-toast/')
    .catch(err=>{
        console.log(err);
    });

//Fetch items from root directory
source.ls('/')
  .then(files => {
    console.log(files);
  })
  .catch(err => {
    console.log(err);
  });

// // //Fetch items from a root folder
// source.ls('/testingdirs/')
//     .then( files => {
//         files.forEach(function (file) {
//             console.log(file.toJSON().name);
//         });
//     })
//     .catch( err => {
//         console.log(err);
//     });

// Fetch items from a root folder and a sub directory
// source.ls('/testingdirs/Directory/')
//     .then( files => {
//          files.forEach(function (file) {
//              console.log(file.toJSON().name);
//          });
//     })
//     .catch( err => {
//         console.log(err);
//     });
//
//
// source.readFile('/testingdirs/Directory/2l0kmekrp1dy.jpg')
//     .then( file => {
//         console.log('File name: ' + file.name + '\n' + 'Last modified: ' + file.lastModified);
//     });


// source.mkdir('/')
//     .then( data => {
//         console.log(data);
//     })
//     .catch( err =>{
//         console.log(err);
//     });

// source.mkdir('/showcasethisapiwhydontyou/')
//     .then( data => {
//         console.log(data);
//     })
//     .catch( err => {
//         console.log(err);
//     });
//
// source.mkdir('/showcasethisapiwhydontyou/showcase/this/api/making/things/')
//     .then(data =>{
//         console.log(data);
//     })
//     .catch(err =>{
//         console.log(err);
//     });

// var writeStream = source.s3.upload({
//     container: 'testingdirs',
//     remote: 'DIRTEST2/'
// });
//

// readStream.pipe(writeStream);
//
//
// console.log(writeStream);

// const readStream = Readable({objectMode: true});
// readStream._read = () => {};
// readStream.push('cats');
//
// //Write to a remote file with a supplied read stream
// source.uploadFile( '/cloudshepherdtesting/fileToWrite.txt', readStream)
//     .then(data => {
//         console.log('Successfully placed file');
//     })
//     .catch(err => {
//         console.log(err);
//     });
//
// readStream.push('dogs');
// readStream.push(null);


// //Pass in a write stream, file contents will be piped to that write stream
// source.downloadFile( '/testingdirs/fileToWrite.txt', process.stdout)
//     .then(data => {
//         console.log('Successfully placed file');
//     })
//     .catch(err => {
//         console.log(err);
//     });


//* ***DANGER***

// Remove item with name from context
// source.destroyFile('/testingdirs/fileToWrite3.txt')
//     .then((data) => {
//         console.log('Successfully destroyed file:' + data);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
//
// //Remove all items from a dir, but not dir itself.
// source.emptyDir('/containertodelete/dirtodelete/')
//     .then(data => {
//         console.log(data);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// //Destroy items in root level directory(container in object storage) but not rootDir itself.
// source.emptyRootDir('/containertodelete/')
//     .then(data => {
//         console.log(data);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
//
// //Remove a directory and its items.
// source.destroyDir('/containertodelete/dirtodelete/subsubdirtodelete/')
//     .then(data => {
//         console.log(data);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
//
// //Remove a root level directory(Container in object storage) and its items.
// source.destroyRootDir('/containertodelete/')
//     .then(data => {
//         console.log(data);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
//
//
// // DANGER: Unsafe delete function. Will delete items at whatever path you provide it. Primary use is for internal
// // functions... one wrong typo and you could mistakenly dilete your entire bucket. Use explicit delete functions
// // save yourself the trouble.
// source.unlink('/containertodelete/dirtodelete/subsubdirtodelete/')
//     .then(data => {
//         console.log(data);
//     })
//     .catch((err) => {
//         console.log(err);
//     });


// source.rootDirExists('/containertodelete/')
//     .then(doesFileExist => {
//         console.log('Does root dir exist? : ', doesFileExist );
//     })
//     .catch((err) => {
//         console.log(err);
//     });
//
// source.dirExists('/containertodelete/dir/subdir/')
//     .then(doesFileExist => {
//         console.log('Does dir exist? : ', doesFileExist );
//     })
//     .catch((err) => {
//         console.log(err);
//     });
//
// source.fileExists('/gigofbuffalos/buffalo.jpg')
//     .then(doesFileExist => {
//         console.log('Does file exist? : ', doesFileExist );
//     })
//     .catch((err) => {
//         console.log(err);
//     });


// //Move file from source context to dest context
// source.copyFile('/cloudshepherdtesting/fileToWrite.txt', '/cloudshepherdtesting/copytest/fileToCopy.txt')
//     .then(data => {
//         console.log(data);
//         console.log('Successfully copied file');
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// source.ls('/cloudshepherdtesting/copytestdest/')
//     .then(data =>{
//
//     })
//     .catch(err =>{
//         console.log(err);
//     });

// source.ls('/')
//     .then( data =>{
//         console.log(data);
// });
// source.ls('/cloudshepherdtesting/copytotest/')
//     .then( data =>{
//         console.log(data);
//     });
//
// source.stat('/cloudshepherdtesting/copytotest/')
//     .then( data =>{
//         console.log(data)
//     });


// Move file from source context to dest context
// source.copyDir('/cloudshepherdtesting/copytest/', '/cloudshepherdtesting/testagain2/')
//     .then(data => {
//         console.log(data);
//     })
//     .catch((err) => {
//         console.log(err);
//     });


// Move file from source context to dest context
// source.moveDir('/cloudshepherdtesting/copytest/', '/cloudshepherdtesting/movetest/')
//     .then(data => {
//         console.log('Successfully moved file');
//     });


// //Move dir from source context to dest context
// source.moveDir('/testingDirs/makeTest/', '/moveTest/makeTest/')
//     .then(data => {
//         console.log('Successfully placed dir');
//     })
//     .catch((err) => {
//         // Handle any error that occurred in any of the previous
//         // promises in the chain.
//     });
//

//
// //Move dir from source context to dest context
// source.copyDir('/testingDirs/makeTest/', '/moveTest/makeTest/')
//     .then(data => {
//         console.log('Successfully placed dir');
//     })
//     .catch((err) => {
//         // Handle any error that occurred in any of the previous
//         // promises in the chain.
//     });
//


// Migrate File
// source.migrateFile('/cloudshepherdtesting/fileToWrite.txt', destination, '/destinationcloudtest/fileToWriteTest.txt');
// source.migrateDir('/cloudshepherdtesting/testagain/', destination, '/destinationcloudtest/testagain/');

// Migrate Directory
// source.migrateDirectory('',)
