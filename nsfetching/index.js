function createNSFetching (isString, q, qlib) {
  'use strict';

  var _nss, _nssaux;
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

  function descFetcherFromNS (ns, username, nsname, nsgroup) {
    var ret;
    if (!nsgroup) {
      ret = q(ns.reduce(function (result, entry) {
        if (entry.username === username && entry.namespace === nsname) {
          result.push(entry);
        }
        return result;
      }, []));
    } else {
      ret = ns.reduce(function (result, entry) {
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

  function onNSSFetching (username, nsname, nsgroup, result) {
    if (result === null || ('length' in result  && result.length===0)) {
      return descFetcherFromNS(_nss, username, nsname, nsgroup);
    }
    return result;
  }

  function nsDescFetcher (username, nsname, nsgroup) {
    if ('object' === typeof username && username && 'takeauxfrompath' in username && isString(username.takeauxfrompath)) {
      try {
        _nssaux = fetchNSS(username.takeauxfrompath);
      } catch (ignore) {}
      return;
    }
    if (!_nss) {
      return fetchNSS().then(retryNSDescFetcher.bind(null, username, nsname, nsgroup));
    }
    if (!(isString(nsname) && nsname)) {
      nsname = null;
    }
    if (_nssaux) {
      return qlib.promise2decision(descFetcherFromNS(_nssaux, username, nsname, nsgroup), onNSSFetching.bind(null, username, nsname, nsgroup));
    }
    return descFetcherFromNS(_nss, username, nsname, nsgroup);
  }

  return nsDescFetcher;
}

module.exports = createNSFetching;
