
const Cloud = require('./cloud.js');


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
        this.AWS = require('aws-sdk');
        this.AWS.config.update ({
            accessKeyId: credentials.user.accessKeyId,
            secretAccessKey: credentials.user.secretAccessKey,
        });

        this.s3 = new this.AWS.S3();




    }

    fetchRootObjects() {
        return new Promise ((resolve, reject) => {
            this.s3.listBuckets( (err, data) => {
                if (err) {
                    reject (err);
                }
                resolve (data);

            });

        });
    }

    //Should supply the full filepath of directory, at the very least a root directory
    //Path should be in linux fashion, '/' for root '/dir/file'
    fetchObjects( path, limit='10', delimiter='' ){

        S3Cloud.validateObjectPath(path);

        if( path === '/' ) {
            return this.fetchRootObjects();
        }

        let bucket = path.split('/')[1];

        path = S3Cloud.parseObjectPath(path);

        return new Promise ((resolve, reject) => {
            const params = {
                Bucket: bucket,
                Prefix: path,
                Delimiter: '',
            };

            this.s3.listObjectsV2 (params, (err, data) => {
                if (err) {
                    reject (err);
                }
                resolve (data);
            });

        });


    }

    makeBucket( bucketName ) {
        const params = {
            Bucket: bucket,
            Prefix: path,
        };
        return new Promise ((resolve, reject) => {
            this.s3.createBucket(params, function(err, data) {
                if (err) {
                    reject (err);
                }
                resolve (data);

            });

        });
    }

    makeDirectory( path ) {


        S3Cloud.validateObjectPath(path);

        if( path === '/' ) {
            throw "ERROR: '/' Provided as path for S3.putObject";
        }

        let bucket = path.split('/')[1];

        path = S3Cloud.parseObjectPath(path);
        path = path + '/';
        return new Promise ((resolve, reject) => {
            const params = {
                Bucket: bucket,
                Key: path,
                Body: ''};
            console.log(path);
            this.s3.putObject(params, function(err, data) {

                if (err) {

                    console.log(err)

                } else {

                    console.log("\nSuccessfully uploaded object..");

                }

            });
        });


    }
    //Create an object at the given path
    putObject( path, body ) {

        S3Cloud.validateObjectPath(path);

        if( path === '/' ) {
            throw "ERROR: '/' Provided as path for S3.putObject";
        }

        let bucket = path.split('/')[1];

        path = S3Cloud.parseObjectPath(path);
        console.log(bucket, path, body);
        return new Promise ((resolve, reject) => {
            const params = {
                Bucket: bucket,
                Key: path,
                Body: body};

            this.s3.putObject(params, function(err, data) {

                if (err) {

                    console.log(err)

                } else {

                    console.log("\nSuccessfully uploaded object..");

                }

            });
        });

    }

    static validateObjectPath( path ) {
        if( path == null ) {
            throw "VALID PATH ERROR: Path is null";
        }
    }

    static parseObjectPath( path ) {
        let splitPath = path.split('/');


        //remove bucket from path
        //if thats all there is return ''

        splitPath[0] = '';
        splitPath[1] = '';

        if( splitPath === '/') {
            return ''
        }
        else {
            return splitPath.join('');
        }

    }

    static test(){
        const credentials = require('../credentials');

        let source = new S3Cloud(credentials);



        //Get root
        source.fetchObjects('/', 10, '')
            .then(data =>{
               console.log('Get list of buckets/root', '\n', data);
            });

        //Get dir
        source.fetchObjects('/testingdirs/', 10, '')
            .then(data =>{
                console.log('Get list of objects in bucket testingdirs', '\n', data);
            });

        //PutObject
        source.putObject('/testingdirs/s3Test','hello');

        //MakeDirectory
        source.makeDirectory('/testingdirs/directoryTest/');


        //Migrate File
        //source.migrateFile('/testingdirs/s3Test', dest, '/destination/path/');

        //Migrate Directory
        //source.migrateDirectory('',)
    }
}



module.exports = S3Cloud;