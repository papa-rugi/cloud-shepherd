cloud-shepherd :ox: :dromedary_camel: :cow2: :water_buffalo: :ram: 
=========

(*STILL IN DEVELOPMENT*)

An NPM module that abstracts away the complexities of cloud storage services
(Object Storage (AWS s3) as well as File Storage(Dropbox)) to easily interact with multiple clouds through one api
using a simple promise based, POISIX interface. 

Amaze your friends and family as you perform operations on multiple cloud clients at once (in parallel)
without having to dig up documentation , build custom wrappers, or spend time thinking about blobs and keys. 

(If by chance there are any stream experts out there, message me. Would love some insight!)

Currently supported clouds:

*s3: in-progress*

| Raskspace: planned |
| Azure: planned |
| Openstack: planned |
| Dropbox: planned |
| Onedrive: planned |
| gDrive: planned |


## Installation

  `npm install cloud-shepherd`


## Usage
    
    //Example using Amazon s3 Api 
    
    const shepherd = require('cloud-shepherd');

    const source = shepherd.cloudFactory.issue('s3', credentials);

    
    // List items from root context
    source.ls('/')
        .then( files => {
            files.forEach(function (files) {
                console.log(files.toJSON());
            });
        })
        .catch( err => {
            console.log(err);
        });
    
    // Fetch items from a root folder or container context
    source.ls('/testingdirs/')
        .then( files => {
            files.forEach(function (file) {
                console.log(file.toJSON().name);
            });
        })
        .catch( err => {
            console.log(err);
        });
    
    //Fetch items from a sub directory
    source.ls('/testingdirs/Directory/')
        .then( files => {
             files.forEach(function (file) {
                 console.log(file.toJSON().name);
             });
        })
        .catch( err => {
            console.log(err);
        });
    
    //Fetch item from path
    source.readFile('/testingdirs/Directory/2l0kmekrp1dy.jpg')
        .then( file => {
            console.log('File name: ' + file.name + '\n' + 'Last modified: ' + file.lastModified);
        });
        
    //Make a directory or container in root context
    source.mkdir('/showcasethisapiwhydontyou/')
        .then( data => {
            console.log(data);
        })
        .catch( err => {
            console.log(err);
        });
    
    //Create a sub-directory tree from a supplied path context
    source.mkdir('/showcasethisapiwhydontyou/showcase/this/api/making/things/')
        .then(data =>{
            console.log(data);
        })
        .catch(err =>{
            console.log(err);
        });
    
    //Upload any file by simply supplying a Readable object and passing
    //it as a parameter. Using streams and promises, this can be done async.
    const readStream = Readable({objectMode: true});
    readStream._read = () => {};
    readStream.push('cats');
    
    source.uploadFile( '/testingdirs/fileToWrite.txt', readStream)
        .then(data => {
            console.log('Successfully placed file');
        })
        .catch(err => {
            console.log(err);
        });
    
    readStream.push('dogs');
    readStream.push(null);

    //Pass in a write stream, file contents will be piped to that write stream
    source.downloadFile( '/testingdirs/fileToWrite.txt', process.stdout)
        .then(data => {
            console.log('Successfully placed file');
        })
        .catch(err => {
            console.log(err);
        });

## Tests

  `npm test`

## Contributing

Roadmap still being worked out. Hop onto this discord server if you want to reach me: https://discord.gg/PPpWSdb
