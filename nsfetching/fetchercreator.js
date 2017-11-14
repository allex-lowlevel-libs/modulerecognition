var fs = require('fs'),
  Path = require('path');

var _nsfilename = '.allexns.json';

function createNSFetcher (q, qlib) {
  'use strict';

  function checkForPath (path) {
    var d = q.defer(), ret = d.promise;
    fs.access(path, fs.constants.R_OK, function (err) {
      if (err) {
        d.resolve(null);
      } else {
        d.resolve(path);
      }
      d = null;
      path = null;
    });
    return ret;
  }

  function decideOnDirectory (dirpath) {
    if (!dirpath) {
      return null;
    }
    return qlib.promise2decision(checkForPath(Path.join(dirpath, _nsfilename)), decideOnNSFile.bind(null, dirpath));
  }

  function decideOnNSFile (dirpath, filepath) {
    var back;
    if (!filepath) {
      back = Path.normalize(Path.join(dirpath, '..'));
      if (back === dirpath) {
        return null;
      }
      return findNSFile(back);
    }
    return filepath;
  }

  function findNSFile (path) {
    if (!path) {
      path = Path.resolve();
    }
    return qlib.promise2decision(checkForPath(path), decideOnDirectory);
  }

  function requirer (nsfilepath) {
    if (!nsfilepath) {
      return null;
    }
    return require(nsfilepath);
  }

  function fetchNSS (auxpath) {
    if (auxpath) {
      return requirer(Path.join(auxpath, _nsfilename));
    }
    return findNSFile().then(requirer);
  }

  return fetchNSS;
}

module.exports = createNSFetcher;
