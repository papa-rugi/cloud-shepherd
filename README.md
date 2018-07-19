cloud-shepherd :ox: :dromedary_camel: :cow2: :water_buffalo: :ram: 
=========

(*STILL IN DEVELOPMENT*)

A NPM module that abstracts away the complexities of cloud storage services
(Object Storage (AWS s3) as well as File Storage(Dropbox)) to easily interact with multiple clouds through one api
using a simple promise based, POISIX interface. 

Amaze your friends and family as you perform operations on multiple cloud clients at once (in parallel)
without having to dig up documentation , build custom wrappers, or spend time thinking about blobs and keys. 

(If by chance there are any stream experts out there, message me. Would love some insight!)

Currently supported clouds:

*s3: supported*

| Raskspace: in-progress |
| Azure: in-progress |
| Openstack: in-progress |
| Google: in-progress |
| HP: in-progress |

| Box: planned |
| Dropbox: planned |
| Onedrive: planned |
| gDrive: planned |


Currently supported features:

| cloud to cloud migration: supported |
| timed file mirroring/syncing between cloud: planned |
| timed local filesystem backups: planned |




## Installation

  `npm install cloud-shepherd`


## Usage
    
    //Example using Amazon s3 Api 
    
    const shepherd = require('cloud-shepherd');
    
    const srcCredentials = {
        secretAccessKey : 'yourSecret',
        accessKey : 'yourAccessKey'
    };
    
    const destCredentials = {
            secretAccessKey : 'yourSecret',
            accessKey : 'yourAccessKey'
        };

    const source = shepherd.herd('s3', srcCredentials);
    const destination = shepherd.herd('s3', destCredentials);

    //Migrate files from one cloud herd to another with the migrate function.
    source.migrateFile('/cloudshepherdtesting/fileToWrite.txt', destination, 
                        '/destinationcloudtest/fileToWriteTest.txt');
    
    source.migrateDir('/cloudshepherdtesting/testagain/', destination,
                        '/destinationcloudtest/testagain/');
    
    // List files or dirs from a given path context with the ls function.
    source.ls('/')
        .then( files => {
            console.log(files);
        })
      
    source.ls('/testingdirs/')
        .then( files => {
            console.log(files);
        })
       
    
    source.ls('/testingdirs/directory/')
        .then( files => {
             console.log(files);
        })
       
    
    //Get detailed metadata of all targets in a 
    //given path context with the stat function. 
    source.stat('/testingdirs/Directory/2l0kmekrp1dy.jpg')
        .then( file => {
            console.log('File name: ' + file.name + '\n' + 'Last modified: ' + file.lastModified);
        });
        
    //Make a directory with the supplied path.
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
    
    //Upload any file by passing a Readable object to the uploadFile function.
    const Readable = require('stream').Readable;
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

    //Download a file by passing a Writeable object to the downloadFile function. 
    source.downloadFile( '/testingdirs/fileToWrite.txt', process.stdout)
        .then(data => {
            console.log('Successfully placed file');
        });
       
        
     // Using unlink you can delete a file or dir. For safety reasons, it is 
     // more explicit destroyFile and destroyDir functions have been added
     // that will prevent you from deleting an un-intended item.
     source.unlink('/containertodelete/dirtodelete/subsubdirtodelete/')
         .then(item => {
             console.log(item);
         });
         
    source.destroyFile('/testingdirs/fileToWrite3.txt')
        .then((file) => {
            console.log('Successfully destroyed file:' + file);
        });
        
    source.destroyDir('/testingdirs/')
            .then((dir) => {
                console.log('Successfully destroyed file:' + dir);
            });
        
        
    // EmptyDir and EmptyRootDir functions will allow you to delete a dir's contents
    // without deleting the dir itself.
    source.emptyDir('/containertodelete/dirtodelete/')
        .then(data => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        });

    source.emptyRootDir('/containertodelete/')
        .then(data => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        });
        
    // Use rootDirExists, dirExists, or fileExists to check whether or not a given item exists
    // at at your current herd context.
    source.rootDirExists('/containertodelete/')
        .then(doesFileExist => {
            console.log('Does root dir exist? : ', doesFileExist );
        })
        .catch((err) => {
            console.log(err);
        });
    
    source.dirExists('/containertodelete/dir/subdir/')
        .then(doesFileExist => {
            console.log('Does dir exist? : ', doesFileExist );
        })
        .catch((err) => {
            console.log(err);
        });
    
    source.fileExists('/gigofbuffalos/buffalo.jpg')
        .then(doesFileExist => {
            console.log('Does file exist? : ', doesFileExist );
        })
        .catch((err) => {
            console.log(err);
        });
     
    //Copy a file or dir at a given path to a supplied path    
    source.copyFile('/cloudshepherdtesting/fileToWrite.txt', '/cloudshepherdtesting/copytest/fileToCopy.txt')
        .then(data => {
            console.log(data);
            console.log('Successfully copied file');
        })
        .catch((err) => {
            console.log(err);
        });
        
    source.copyDir('/cloudshepherdtesting/copytest/', '/cloudshepherdtesting/')
            .then(data => {
                console.log(data);
                console.log('Successfully copied file');
            })
            .catch((err) => {
                console.log(err);
            });
    
    // MoveFile and moveDir are just like copy, except that they will delete your supplied src path
    // after copying.
    source.copyFile('/cloudshepherdtesting/fileToWrite.txt', '/cloudshepherdtesting/copytest/fileToCopy.txt')
            .then(data => {
                console.log(data);
                console.log('Successfully copied file');
            })
            .catch((err) => {
                console.log(err);
            });
            
    source.copyDir('/cloudshepherdtesting/copytest/', '/cloudshepherdtesting/')
            .then(data => {
                console.log(data);
                console.log('Successfully copied file');
            })
            .catch((err) => {
                console.log(err);
            });

## Tests

  `npm test`

## Contributing

Roadmap still being worked out. Hop onto this discord server if you want to reach me: https://discord.gg/PPpWSdb
