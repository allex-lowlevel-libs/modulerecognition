var expect = require('chai').expect,
  lib = require('..')(fakeGetAlias);

function fakeGetAlias(alias) {
  return {
    alias: alias,
    git: 'git@gitlab.hers.rs:'
  };
}

describe('Test', function () {
  it ('repotest', function () {
    var r = lib('git@github.com:allex-lowlevel-libs/modulerecognition.git');
    expect(r).to.be.null;
  })
  it ('service', function () {
    var r = lib('allex:master');
    expect(r.servicename).to.equal('master');
    expect(r.modulename).to.equal('allex_masterservice');
    expect(r.type).to.equal('service');
    expect(r.group).to.equal('allex_services');
    expect(r.namespace).to.be.undefined;
  });
  it ('lib', function () {
    var r = lib('allex:leveldb:lib');
    expect(r.servicename).to.equal('leveldb');
    expect(r.modulename).to.equal('allex_leveldblib');
    expect(r.type).to.equal('lib');
    expect(r.group).to.equal('allex_libs');
    expect(r.namespace).to.be.undefined;
  });
  it ('namespace service', function () {
    var r = lib('allex:lottery_slot');
    expect(r.servicename).to.equal('slot');
    expect(r.modulename).to.equal('allex__lottery_slotservice');
    expect(r.type).to.equal('service');
    expect(r.group).to.equal('allex_lottery_services');
    expect(r.namespace).to.equal('lottery');
  });
  it ('namespace lib', function () {
    var r = lib('allex:indata_fix:lib');
    expect(r.servicename).to.equal('fix');
    expect(r.modulename).to.equal('allex__indata_fixlib');
    expect(r.type).to.equal('lib');
    expect(r.group).to.equal('allex_indata_libs');
    expect(r.namespace).to.equal('indata');
  });
});
