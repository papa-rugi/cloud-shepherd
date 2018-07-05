const S3Cloud = require('./s3Cloud.js')

class CloudFactory {
    static issue(type, credentials) {
        switch( type ) {
            case 's3': return new S3Cloud( credentials );
                break;
        }
    }
}

module.exports = CloudFactory;

