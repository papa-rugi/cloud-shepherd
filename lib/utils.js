const path = require('path');


module.exports = {

  // Determine context of supplied path. This can and should be be cleaned up to be more readable
  getPathType: function(srcPath) {

    if (path.isAbsolute(srcPath) !== true) {
      throw 'Error: Supplied path ' + srcPath + ' is not absolute.';
    }

    srcPath = srcPath.split('/');

    if (srcPath[0] === '' && srcPath[1] === '') {
      return 'root';
    } else if (srcPath[0] === '' && srcPath[1] !== '' && srcPath[2] === '') {
      return 'rootDir';
    } else if (srcPath[0] === '' && srcPath[srcPath.length - 1] === '') {
      return 'dir';
    } else if (srcPath[0] === '' && srcPath[srcPath.length - 1] !== ''){
      return 'file';
    }
  },

  // Grab container from path
  parseContainerFromPath: function(srcPath) {

    if (path.isAbsolute(srcPath) !== true) {
      throw 'Error: Supplied Path ' + srcPath + ' is not absolute.';
    }

    if (module.exports.getPathType(srcPath) === 'root') {
      throw 'Error: Supplied path' + srcPath + ' does not contain a container.';
    }

    srcPath = srcPath.split('/');

    return srcPath[1];
  },

  // Remove root dir from path, return leftover path
  removeRootDirFromPath: function(srcPath) {

    if (path.isAbsolute(srcPath) !== true) {
      throw 'Error: Supplied Path ' + srcPath + ' is not absolute.';
    }

    if (module.exports.getPathType(srcPath) === 'root') {
      throw 'Error: Supplied path' + srcPath + ' does not contain a directory.';
    }

    srcPath = srcPath.split('/');

    srcPath[0] = '';
    srcPath[1] = '';

    srcPath = srcPath.join('/');
    srcPath = srcPath.substring(2);

    srcPath[1] = '';
    srcPath = srcPath.trim();

    return srcPath;

  },



  test: function() {

    console.log('/ is type: ', module.exports.getPathType('/'), '\n');

    console.log('/rootdir/ is type: ', module.exports.getPathType('/rootdir/'), '\n');

    console.log('/rootdir/dir/ is type: ', module.exports.getPathType('/rootdir/dir/'), '\n');

    console.log('/rootdir/dir/file.txt is type: ', module.exports.getPathType('/rootdir/dir/file.txt'), '\n');

  },
};
