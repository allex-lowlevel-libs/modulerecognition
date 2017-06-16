var chai = require('chai'),
  chap = require('chai-as-promised'),
  expect = chai.expect;

chai.use(chap);
var resolve, isString, q;

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
    qlib = require('allex_qextlowlevellib')(_q, inherit.inherit, timeout.runNext, fifo, map, cleanftions.containerDestroyAll);
  resolve = require('../')(checkftions.isString, checkftions.isFunction, _q, qlib);
}

describe ('Outer resolve Tests', function () {
  it('Load the library', function () {
    bootUp();
  });
  it ('Resolve a plain namespace', function () {
    return expect(resolve('npm')).to.eventually.equal('npm');
  });
  it ('Resolve a 2-segment namespace', function () {
    return expect(resolve('allex:master')).to.eventually.deep.equal({
      modulename: 'allex_masterservice',
      reponame: 'master',
      username: 'allex',
      namespace: null,
      group: 'services',
      npmstring: 'git+ssh://git@gitlab.hers.rs/allex_services/master.git'
    });
  });
  it ('Resolve a 3-segment namespace', function () {
    return expect(resolve('allex:buffer:lib')).to.eventually.deep.equal({
      modulename: 'allex_bufferlib',
      reponame: 'buffer',
      username: 'allex',
      namespace: null,
      group: 'libs',
      npmstring: 'git+ssh://git@gitlab.hers.rs/allex_libs/buffer.git'
    });
  });
  it ('Resolve a 4-segment namespace', function () {
    return expect(resolve('allex:indata_fix:lib')).to.eventually.deep.equal({
      modulename: 'allex__indata_fixlib',
      reponame: 'fix',
      username: 'allex',
      namespace: 'indata',
      group: 'libs',
      npmstring: 'git+ssh://git@gitlab.hers.rs/allex_indata_libs/fix.git'
    });
  });
  it ('Resolve a 2-segment string', function () {
    return expect(resolve('allex_masterservice')).to.eventually.deep.equal({
      modulename: 'allex_masterservice',
      reponame: 'master',
      username: 'allex',
      namespace: null,
      group: 'services',
      gitclonestring: 'git@gitlab.hers.rs:allex_services/master.git',
      npmstring: 'git+ssh://git@gitlab.hers.rs/allex_services/master.git'
    });
  });
  it ('Resolve a 3-segment string', function () {
    return expect(resolve('allex_bufferlib')).to.eventually.deep.equal({
      modulename: 'allex_bufferlib',
      reponame: 'buffer',
      username: 'allex',
      namespace: null,
      group: 'libs',
      gitclonestring: 'git@gitlab.hers.rs:allex_libs/buffer.git',
      npmstring: 'git+ssh://git@gitlab.hers.rs/allex_libs/buffer.git'
    });
  });
  it ('Resolve a 4-segment string', function () {
    return expect(resolve('allex__indata_fixlib')).to.eventually.deep.equal({
      modulename: 'allex__indata_fixlib',
      reponame: 'fix',
      username: 'allex',
      namespace: 'indata',
      group: 'libs',
      gitclonestring: 'git@gitlab.hers.rs:allex_indata_libs/fix.git',
      npmstring: 'git+ssh://git@gitlab.hers.rs/allex_indata_libs/fix.git'
    });
  });
  it ('Resolve a 3-segment github string', function () {
    return expect(resolve('allex_modulerecognitionlowlevellib')).to.eventually.deep.equal({
      modulename: 'allex_modulerecognitionlowlevellib',
      reponame: 'modulerecognition',
      username: 'allex',
      namespace: null,
      group: 'lowlevellibs',
      gitclonestring: 'git@github.com:allex-lowlevel-libs/modulerecognition.git',
      npmstring: 'git+ssh://git@github.com/allex-lowlevel-libs/modulerecognition.git'
    });
  });
});


