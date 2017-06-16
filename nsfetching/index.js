function createNSFetching (isString, q, qlib) {
  'use strict';

  var _nss;
  var fetchNSS = require('./fetchercreator')(q, qlib);

  function retryNSDescFetcher (username, nsname, nsgroup, nss) {
    if (!nss) {
      if (!nsgroup) {
        return q([]);
      }
      return q(null);
    }
    _nss = nss;
    return nsDescFetcher(username, nsname, nsgroup);
  }

  function nsDescFetcher (username, nsname, nsgroup) {
    if (!_nss) {
      return fetchNSS().then(retryNSDescFetcher.bind(null, username, nsname, nsgroup));
    }
    if (!(isString(nsname) && nsname)) {
      nsname = null;
    }
    var ret;
    if (!nsgroup) {
      ret = q(_nss.reduce(function (result, entry) {
        if (entry.username === username && entry.namespace === nsname) {
          result.push(entry);
        }
        return result;
      }, []));
    } else {
      ret = _nss.reduce(function (result, entry) {
        if (entry.username === username && entry.namespace === nsname && entry.group === nsgroup) {
          return q(entry);
        }
        return result;
      }, q(null));
    }
    username = null;
    nsname = null;
    nsgroup = null;
    return ret;
  }

  return nsDescFetcher;
}

module.exports = createNSFetching;
