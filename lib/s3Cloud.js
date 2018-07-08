
const Cloud = require('./cloud.js');

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

            accessKeyId: 'AKIAI35FJOJZO3K627BA',

            accessKey: 'Ndq71GK5Wah+zCqURwuCAVdO5K8HeMbot+qZV/2E'

        });
    }

    async fetchItem( itemName, destPath ) {
        return new Promise({  })
    }




    //List items from dir context
      fetchItems( destPath ) {
        destPath = path.parse(destPath);

        if( destPath.dir === '/') {

             return new Promise(function(resolve, reject) {
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


    static test(){
        const credentials = require('../test/credentials');

        let source = new S3Cloud(credentials);

        source.fetchItems('/')
            .then( data=> {
                console.log(data);
            })
            .catch( err=> {
                console.log(err);
            });

        // console.log(path.basename("/"));
        //
        // console.log(path.basename("/testingdirs/"));
        //
        //
        // console.log(path.isAbsolute("testingdirs/"));
        //
        //
        // console.log(path.dirname("/testingdirs/s3Test"));
        //
        //
        // console.log(path.normalize("/testingdirs/s3Test/test/.."));
        //
        // console.log(path.parse('/home/user/dir/file.txt'));
        //
        // console.log(path.parse('/'));
        //
        // console.log(path.parse('/').dir);



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
    }
}



module.exports = S3Cloud;