cloud-shepherd :ox: :dromedary_camel: :cow2: :water_buffalo: :ram: 
=========

[STILL IN ALPHA DEVELOPMENT]
A promise based, multi-cloud POISIX style client wrapper that abstracts away the complexities of Object Storage services, such as AWS s3,
as well as File Storage services, such as Dropbox, in order to easily interact with and move files between multiple clouds 
using an intuitive, familiar, and simple interface.

Amaze your friends and family as you enter the *multi-cloud* future and leave behind the days of having to research provider 
specific documentation, write complicated (and dangerous :scream:) cloud 2 cloud migration scripts, or spend time thinking about 
the esoteric semantics of blobs vs keys. 

### Supported  Services
 ` s3: supported`
 
 ` raskspace: supported `
 
 ` azure: supported `
 
 ` hp: supported `
 
 ` openstack: supported `

 ` gDrive: in-progress `

 ` ftp: planned `
 
 ` box: planned `

 ` dropbox: planned `

 ` onedrive: planned `


### Installing
`npm install cloud-shepherd --save`

### Getting Started
Require the library.

    const shepherd = require('cloud-shepherd');
    
Call '.herd' with the name of your respective cloud provider, as well as a JSON object containing your unique access credentials 
to instantiate your client.

    const credentials = {
        secretAccessKey : 'yourSecret',
        accessKey : 'yourAccessKey'
    };
    
    const service = 's3';
    
    const source = shepherd.herd(service, credentials);

### Methods

#####migrate(srcPath, destHerd, destPath) 

Migrate a file or a directory from one Cloud to another.
```
    const sourceCloud = shepherd.herd('s3', srcCredentials);
    const destinationCloud = shepherd.herd('rackspace', destCredentials);

    sourceCloud.migrateFile('/sourcebucket/fileToMigrate.txt',
                            destinationCloud, 
                            '/destbucket/fileToMigrate.txt');
    
    sourceCloud.migrateDir('/cloudshepherdtesting/mydir/',
                            destinationCloud,
                            '/destinationcloudtest/testagain/');
```

#####ls(path) 

List all files and directories in your Cloud from a given path context.
```
    cloud.ls('/')
        .then( data => {
            console.log(data);
        })
        .catch( err => {
            console.log(data);
        });
    
    cloud.ls('/sourcebucket/')
        .then( data => {
            console.log(data);
        })
        .catch( err => {
            console.log(data);
        });
    
    cloud.ls('/sourcebucket/dir/sub-dir/')
        .then( data => {
            console.log(data);
        })
        .catch( err => {
            console.log(data);
        });                  
```

#####stat(path)

List detailed information about files and/or directories from a given path context. 
```
    cloud.stat('/sourcebucket/fileToMigrate.txt')
        .then( data => {
            console.log(data);
        })
        .catch( err => {
            console.log(data);
        });
```
####mkdir(path)

Create a directory at the given path.
```
    cloud.mkdir('/sourcebucket/')
        .then( data => {
            console.log(data);
        })
        .catch( err => {
            console.log(err);
        });
```
####upload(writePath,readStream)

Upload a file to the given write path context, from a given Readable stream.
```
        const Readable = require('stream').Readable;
        const readStream = Readable({objectMode: true});
        
        readStream._read = () => {};
        readStream.push('buffalo');
        readStream.push('yaks');
        readStream.push(null);
        
        cloud.uploadFile( '/testingdirs/fileToWrite.txt', readStream)
            .then(data => {
                console.log('Successfully placed file');
            })
            .catch(err => {
                console.log(err);
            });
        
       
```
####download(readPath,writeStream)

Read the data from a given path, and write that data to a given Writable stream.
```
    cloud.downloadFile( '/testingdirs/fileToWrite.txt', process.stdout)
        .then(data => {
            console.log('Successfully placed file');
        });
```
####unlink(path)

Delete a file or dir from a given path context. 
```
    cloud.unlink('/container/dir/subdirtodelete/')
             .then(item => {
                 console.log(item);
             });
```


####destroy(path)

A destroy file and destroy dir method have been implemented, to give you peice of mind while removing items. These methods will throw an error if you accidentally delete a file instead of a dir and vice versa.
```
    cloud.destroyFile('/testingdirs/fileToWrite3.txt')
        .then((file) => {
            console.log('Successfully destroyed file:' + file);
        });
            
    cloud.destroyDir('/testingdirs/')
        .then((dir) => {
            console.log('Successfully destroyed file:' + dir);
        });
```

####empty(path)

Will delete all items from a supplied directory context, but will not delete the directory.
```
    cloud.emptyDir('/container/dir/')
        .then(data => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        });
    
    cloud.emptyRootDir('/container/')
        .then(data => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        });
```

####itemExists(path)

Resolves to true or false if a given item exists.
```
    cloud.fileExists('/gigofbuffalos/buffalo.jpg')
        .then(doesFileExist => {
            console.log('Does file exist? : ', doesFileExist );
        })
        .catch((err) => {
            console.log(err);
        });
    cloud.dirExists('/containertodelete/dir/subdir/')
        .then(doesFileExist => {
            console.log('Does dir exist? : ', doesFileExist );
        })
        .catch((err) => {
            console.log(err);
        });
    cloud.rootDirExists('/containertodelete/')
        .then(doesFileExist => {
            console.log('Does root dir exist? : ', doesFileExist );
        })
        .catch((err) => {
            console.log(err);
        });
```
####copy(srcPath,dstPath)

Copys a file or directory from a given path, to a given path. *Will overwrite by default*
```
    cloud.copyFile('/cloudshepherdtesting/fileToWrite.txt', 
                    '/cloudshepherdtesting/copytest/fileToCopy.txt')
        .then(data => {
            console.log(data);
            console.log('Successfully copied file');
        })
        .catch((err) => {
            console.log(err);
        });
        
    cloud.copyDir('/cloudshepherdtesting/copytest/', 
                    '/cloudshepherdtesting/')
        .then(data => {
            console.log(data);
            console.log('Successfully copied file');
        })
        .catch((err) => {
            console.log(err);
        });
        
```
####move(srcPath,dstPath)

Moves a file or directory from a given path, to a given path and then deletes the source path. *Will overwrite by default*
```
    cloud.moveFile('/cloudshepherdtesting/fileToWrite.txt', 
                    '/cloudshepherdtesting/copytest/fileToCopy.txt')
        .then(data => {
            console.log(data);
            console.log('Successfully copied file');
        })
        .catch((err) => {
            console.log(err);
        });
        
    ccloud.moveDir('/cloudshepherdtesting/copytest/', 
                    '/cloudshepherdtesting/')
        .then(data => {
            console.log(data);
            console.log('Successfully copied file');
        })
        .catch((err) => {
            console.log(err);
        });
        
``` 
### Credential Format
```
  amazon: {
    secretAccessKey: 'myKey',
    accessKey: 'myAccessKey',
  }

  rackspace: {
    username: 'myUsername',
    apiKey: 'myApiKey',
    service: 'storage',
    region: 'myRegion',
  }

  azure: {
    storageAccount: 'myAccount',
    storageAccessKey: 'myStorageAccessKey'
  }
  
  hp: {
    username: 'myUsername',
    apiKey: 'myApiKey',
    region: 'myRegion',
    authUrl: 'myAuthUrl',
  },
  
  openstack: {
    provider: 'openstack',
    username: 'myUsername',
    password: 'myPassword',
    authUrl: 'myAuthUrl',
  },
```

## Tests

  `npm test`

## Contributing

Roadmap still being worked out. Hop onto this discord server if you want to reach me: https://discord.gg/PPpWSdb or email
me at alexanderlcodes@gmail.com
