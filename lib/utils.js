const path = require('path');


module.exports = {
    getPathType: function( myPath) {
        if( path.isAbsolute(myPath) !== true ) {
            return null;
        }

        myPath = myPath.split('/');

        if( myPath[0] === '' && myPath[1] === '' ) {
            return 'root';
        }
        else if( myPath[0] === '' && myPath[1] !== '' && myPath.length === 2 ) {
            return 'rootDir';
        }
        else {
            return 'dir';
        }
    }
};