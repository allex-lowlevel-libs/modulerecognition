var chai = require('chai'),
  chap = require('chai-as-promised'),
  expect = chai.expect;

chai.use(chap);
var Resolver, isString, q;

function bootUp () {
  var checkftions = require('allex_checkslowlevellib'),
    cleanftions = require('allex_destructionlowlevellib')(checkftions.isFunction, checkftions.isArray, checkftions.isNumber, checkftions.isString),
    inherit = require('allex_inheritlowlevellib'),
    functionmanip = require('allex_functionmanipulationlowlevellib')(inherit.inherit),
    dlinkedlistbase = require('allex_doublelinkedlistbaselowlevellib'),
    fifo = require('allex_fifolowlevellib')(dlinkedlistbase, inherit.inherit),
    timeout = require('allex_timeoutlowlevellib')(checkftions.isFunction, fifo),
    eventemitter = require('allex_eventemitterlowlevellib')(dlinkedlistbase, inherit.inherit, checkftions.isFunction, checkftions.isArrayOfFunctions),
    avltreelib = require('allex_avltreelowlevellib')(dlinkedlistbase, inherit.inherit),
    map = require('allex_maplowlevellib')(avltreelib, inherit.inherit),
    _q = require('allex_qlowlevellib')(timeout.runNext, checkftions.isArray, checkftions.isFunction, inherit.inherit, functionmanip.dummyFunc, eventemitter),
    qlib = require('allex_qextlowlevellib')(_q, inherit.inherit, timeout.runNext, fifo, map, cleanftions.containerDestroyAll),
    ResolverClass = require('../resolvercreator')(checkftions.isString, checkftions.isFunction, _q, qlib);
  Resolver = new ResolverClass(nsDescFetcher);
  isString = checkftions.isString;
  q = _q;
}


var _nss = [
  {username: "allex", namespace: null, group: "services", type: "git", user: "git", server: "github.com", repogroup: "allex-services"},
  {username: "allex", namespace: null, group: "libs", type: "git", user: "git", server: "github.com", repogroup: "allex-libs"},
  {username: "allex", namespace: "topclient", group: "libs", type: "git", user: "git", server: "gitlab.topclient.info", repogroup: "allex_libs"}
];

function nsDescFetcher (username, nsname, nsgroup) {
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

describe ('Resolver Tests', function () {
  it('Load the library', function () {
    bootUp();
  });
  it ('Resolve a plain namespace', function () {
    return expect(Resolver.resolve('npm')).to.eventually.equal('npm');
  });
  it ('Resolve a 2-segment namespace', function () {
    return expect(Resolver.resolve('allex:master')).to.eventually.deep.equal({
      modulename: 'allex_masterservice',
      reponame: 'master',
      username: 'allex',
      namespace: null,
      group: 'services',
      npmstring: 'git+ssh://git@github.com/allex-services/master.git',
      gitclonestring: 'git@github.com:allex-services/master.git'
    });
  });
  it ('Resolve a 3-segment namespace', function () {
    return expect(Resolver.resolve('allex:buffer:lib')).to.eventually.deep.equal({
      modulename: 'allex_bufferlib',
      reponame: 'buffer',
      username: 'allex',
      namespace: null,
      group: 'libs',
      npmstring: 'git+ssh://git@github.com/allex-libs/buffer.git',
      gitclonestring: 'git@github.com:allex-libs/buffer.git'
    });
  });
  it ('Resolve a 4-segment namespace', function () {
    return expect(Resolver.resolve('allex:topclient_fix:lib')).to.eventually.deep.equal({
      modulename: 'allex__topclient_fixlib',
      reponame: 'fix',
      username: 'allex',
      namespace: 'topclient',
      group: 'libs',
      npmstring: 'git+ssh://git@gitlab.topclient.info/allex_libs/fix.git',
      gitclonestring: 'git@gitlab.topclient.info:allex_libs/fix.git'
    });
  });
  it ('Resolve a 2-segment string', function () {
    return expect(Resolver.resolve('allex_masterservice')).to.eventually.deep.equal({
      modulename: 'allex_masterservice',
      reponame: 'master',
      username: 'allex',
      namespace: null,
      group: 'services',
      npmstring: 'git+ssh://git@github.com/allex-services/master.git',
      gitclonestring: 'git@github.com:allex-services/master.git'
    });
  });
  it ('Resolve a 3-segment string', function () {
    return expect(Resolver.resolve('allex_bufferlib')).to.eventually.deep.equal({
      modulename: 'allex_bufferlib',
      reponame: 'buffer',
      username: 'allex',
      namespace: null,
      group: 'libs',
      npmstring: 'git+ssh://git@github.com/allex-libs/buffer.git',
      gitclonestring: 'git@github.com:allex-libs/buffer.git'
    });
  });
  it ('Resolve a 4-segment string', function () {
    return expect(Resolver.resolve('allex__topclient_fixlib')).to.eventually.deep.equal({
      modulename: 'allex__topclient_fixlib',
      reponame: 'fix',
      username: 'allex',
      namespace: 'topclient',
      group: 'libs',
      gitclonestring: 'git@gitlab.topclient.info:allex_libs/fix.git',
      npmstring: 'git+ssh://git@gitlab.topclient.info/allex_libs/fix.git'
    });
  });
});


