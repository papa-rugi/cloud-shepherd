


const cloudherder = require('../lib/main.js');

const credentials = require('./credentials.js');

const source = cloudherder.cloudFactory.issue('s3', credentials);



/****TESTING***/
const path = require('path');
const util = require('../lib/utils.js');
const stream = require('stream');
const Readable = require('readable-stream').Readable;


// Fetch items from root directory
source.ls('/')
    .then( files => {
        files.forEach(function (files) {
            console.log(files.toJSON());
        });
    })
    .catch( err => {
        console.log(err);
    });

// //Fetch items from a root folder
source.ls('/testingdirs/')
    .then( files => {
        files.forEach(function (file) {
            console.log(file.toJSON().name);
        });
    })
    .catch( err => {
        console.log(err);
    });

//Fetch items from a root folder and a sub directory
source.ls('/testingdirs/Directory/')
    .then( files => {
         files.forEach(function (file) {
             console.log(file.toJSON().name);
         });
    })
    .catch( err => {
        console.log(err);
    });


source.readFile('/testingdirs/Directory/2l0kmekrp1dy.jpg')
    .then( file => {
        console.log('File name: ' + file.name + '\n' + 'Last modified: ' + file.lastModified);
    });


// source.mkdir('/')
//     .then( data => {
//         console.log(data);
//     })
//     .catch( err =>{
//         console.log(err);
//     });

source.mkdir('/showcasethisapiwhydontyou/')
    .then( data => {
        console.log(data);
    })
    .catch( err => {
        console.log(err);
    });

source.mkdir('/showcasethisapiwhydontyou/showcase/this/api/making/things/')
    .then(data =>{
        console.log(data);
    })
    .catch(err =>{
        console.log(err);
    });

// var writeStream = source.s3.upload({
//     container: 'testingdirs',
//     remote: 'DIRTEST2/'
// });
//
// const readStream = Readable({objectMode: true});
// readStream._read = () => {};
// readStream.push('goats');
// readStream.push(null);
// readStream.pipe(writeStream);
//
//
// console.log(writeStream);




// source.mkdir('/bucketHerdTest/dirCreationTest')
//     .then( data => {
//         console.log(data);
//     });


//Herd should always start with a directory context... maybe hold current directory
//context in object?


//Fetch item from a supplied path
// source.fetchItem('/testingdirs/doesFileExist', params)
//     .then(data => {
//         console.log('Return file if it exists, else  \n', data);
//     })
//     .catch((err) => {
//         // Handle any error that occurred in any of the previous
//         // promises in the chain.
//     });
//
// //List items from root context
// source.fetchItems('/', params)
//     .then(data => {
//        console.log('Get list dirs from root context \n', data);
//     })
//     .catch((err) => {
//         // Handle any error that occurred in any of the previous
//         // promises in the chain.
//     });
//
// //List items from dir context
// source.fetchItems('/testingdirs/', params)
//     .then(data => {
//         console.log('List files from testingdirs dir context \n', data);
//     })
//     .catch((err) => {
//     // Handle any error that occurred in any of the previous
//     // promises in the chain.
//     });
//
//
//
// //Put item with name and data at location
// source.placeFile('/testingDirs/', 'itemToPut', body)
//     .then(data => {
//         console.log('Successfully placed file');
//     })
//     .catch((err) => {
//         // Handle any error that occurred in any of the previous
//         // promises in the chain.
//     });
//
// //Make directory at dir contxt
// source.placeDir('/testingdirs/', 'makeTest')
//     .then(data => {
//         console.log('Successfully placed dir');
//     })
//     .catch((err) => {
//         // Handle any error that occurred in any of the previous
//         // promises in the chain.
//     });
//
// //Move file from source context to dest context
// source.moveFile('/testingDirs/moveTest', '/moveTest/moveTest')
//     .then(data => {
//         console.log('Successfully moved file');
//     })
//     .catch((err) => {
//         // Handle any error that occurred in any of the previous
//         // promises in the chain.
//     });
//
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
// //Move file from source context to dest context
// source.copyFile('/testingDirs/moveTest', '/moveTest/moveTest')
//     .then(data => {
//         console.log('Successfully copied file');
//     })
//     .catch((err) => {
//         // Handle any error that occurred in any of the previous
//         // promises in the chain.
//     });
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
// //****DANGER***
//
// //Remove item with name from context
// source.destroyFile('/testingDirs/', 'itemToRemove')
//     .then(data => {
//         console.log('Successfully destroyed file');
//     })
//     .catch((err) => {
//         // Handle any error that occurred in any of the previous
//         // promises in the chain.
//     });
//
// //Remove a directory and its items
// source.destroyDir('/testingDirs', 'itemToRemove')
//     .then(data => {
//         console.log('Successfully destroyed dir and all of its contents');
//     })
//     .catch((err) => {
//         // Handle any error that occurred in any of the previous
//         // promises in the chain.
//     });




//Get root
// source.fetchObjects('/', 10, '')
//     .then(data =>{
//        console.log('Get list of buckets/root', '\n', data);
//     });
//
// //Get dir
// source.fetchObjects('/testingdirs/', 10, '')
//     .then(data =>{
//         console.log('Get list of objects in bucket testingdirs', '\n', data);
//     });
//
// //PutObject
// source.putObject('/testingdirs/s3Test','hello');
//
// //MakeDirectory
// source.makeDirectory('/testingdirs/directoryTest/');


//Migrate File
//source.migrateFile('/testingdirs/s3Test', dest, '/destination/path/');

//Migrate Directory
//source.migrateDirectory('',)