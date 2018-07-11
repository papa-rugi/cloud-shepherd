const path = require('path');


module.exports = {

    //Determine context of supplied path
    getPathType: function( srcPath ) {

        if( path.isAbsolute(srcPath) !== true ) {
            throw "Error: Supplied path " + srcPath + " is not absolute.";
        }

        srcPath = srcPath.split('/');

        if( srcPath[0] === '' && srcPath[1] === '' ) {
            return 'root';
        }
        else if( srcPath[0] === '' && srcPath[1] !== '' && srcPath.length === 2 ) {
            return 'rootDir';
        }
        else {
            return 'dir';
        }
    },

    //Grab container from path
    parseContainerFromPath: function ( srcPath ) {

        if( path.isAbsolute(srcPath) !== true ) {
            throw "Error: Supplied Path " + srcPath + " is not absolute.";
        }

        if( module.exports.getPathType(srcPath) === 'root' ) {
            throw "Error: Supplied path" + srcPath + " does not contain a container."
        }

        srcPath = srcPath.split('/');

        return srcPath[1];
    },

    //Remove container from path, return directory thats leftover
    parseDirFromPath: function ( srcPath) {

        if( path.isAbsolute(srcPath) !== true ) {
            throw "Error: Supplied Path " + srcPath + " is not absolute.";
        }

        if( module.exports.getPathType(srcPath) === 'root' ) {
            throw "Error: Supplied path" + srcPath + " does not contain a container."
        }

        srcPath = srcPath.split('/');

        srcPath[0] = '';
        srcPath[1] = '';

        srcPath = srcPath.join('/');
        srcPath = srcPath.substring(2);

        srcPath[1] = '';
        srcPath = srcPath.trim();

        return srcPath;
    }
};