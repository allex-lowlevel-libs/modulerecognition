function createResolutionLib (isString, isFunction, q, qlib) {
  'use strict';

  var Resolver = require('./resolvercreator')(isString, isFunction, q, qlib),
    nsDescFetcher = require('./nsfetching')(isString, q, qlib),
    resolver = new Resolver(nsDescFetcher);

  return resolver.resolve.bind(resolver);

}

module.exports = createResolutionLib;
