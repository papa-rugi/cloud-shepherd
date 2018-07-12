cloud-herder :ox: :dromedary_camel: :cow2: :water_buffalo: :ram: 
=========

An NPM module that abstracts away the complexities of cloud storage services
(Object Storage (AWS s3) as well as File Storage(Dropbox) to easily interact with multiple clouds using a unified
POISIX interface. 

Amaze your friends and family as you perform operations on multiple cloud clients at once (in parallel)
without having to dig up documentation , build custom wrappers, or spend time thinking about blobs and keys. 

Promise and stream based!

## Installation

  `npm install cloud-herder`


## Usage
    
    //Example using Amazon s3 Api 
    const source = cloudherder.cloudFactory.issue('s3', credentials);

    
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



## Tests

  `npm test`

## Contributing

Roadmap still being worked out. Hop onto this discord server if you want to reach me: https://discord.gg/PPpWSdb