function createResolver (isString, isFunction, q, qlib) {
  'use strict';

  var stringAnalyzer = require('./stringanalysis')(q, qlib);

  function Resolver (nsdescfetcherfunc) {
    if (!isFunction(nsdescfetcherfunc)) {
      throw new Error('Resolver needs a NameSpace Descriptor fetcher function in its constructor');
    }
    this.nsDescFetcher = nsdescfetcherfunc;
  }
  Resolver.prototype.destroy = function () {
    this.nsDescFetcher = null;
  };
  Resolver.prototype.resolve = function (namespacestring) {
    if (!isString(namespacestring)) {
      return q(null);
    }
    return qlib.promise2decision(stringAnalyzer(namespacestring, this.nsDescFetcher), this.onAnalysys.bind(this, namespacestring));
  };
  Resolver.prototype.onAnalysys = function (namespacestring, result) {
    if (!result) {
      return namespacestring;
    }
    return result;
  };
  Resolver.prototype.onUserFetched = function (split0, user) {
    if (!(user && user.status === 'active')) {
      return null;
    }
    if (!this.nsDescFetcher) {
      return null;
    }
    return this.nsDescFetcher
  };

  return Resolver;
}

module.exports = createResolver;
