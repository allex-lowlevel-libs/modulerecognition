function createModuleRecognition (q, qlib) {
  'use strict';
  var qnull = q(null),
      shortNotationExpander = require('./shortnotationexpandercreator')(q, qlib),
      descuserlib = require('./descuser'),
      GITURLREGEXP = /((git|ssh|http(s)?)|(git@[\w\.]+))(:(\/)?)([\w\.@\:\/\-~]+)(\.git)?(\/)?/; ///should be tested more ... visit https://www.debuggex.com/


  function checkForSuffix(mmn, mmns, resultobj, suffix){
    var reponame, namespace, secondunderscorepos, group, lastindex;
    lastindex = mmns.lastIndexOf(suffix.group);
    if(lastindex<1 || lastindex!==mmns.length-suffix.group.length){
      return resultobj;
    }
    reponame = mmn.substring(suffix.username.length+1,mmn.length-suffix.group.length+1);
    namespace = null;
    if(reponame.charAt(0)==='_'){
      secondunderscorepos = (reponame.substring(1)).indexOf('_');
      if(secondunderscorepos>0){
        secondunderscorepos++; //because of reponame's substring(1)
        namespace = reponame.substring(1,secondunderscorepos);
        reponame = reponame.substring(secondunderscorepos+1);
        group = suffix.username+'_'+namespace+'_'+suffix.group;
      }
    }
    if(!group){
      group = suffix.username+'_'+suffix.group;
    }

    switch (suffix.type) {
      case 'git':
        if (resultobj.matchlen < suffix.group.length) {
          resultobj.matchlen = suffix.group.length;
          resultobj.result = {
            modulename: mmn,
            username: suffix.username,
            gitclonestring: descuserlib.gitclonestring(suffix, reponame),
            npmstring : descuserlib.gitsshnpmstring(suffix, reponame),
            group: suffix.group,
            reponame: reponame,
            namespace: namespace
          };
        }
        return resultobj;
    }
    return resultobj
  }
  function recognizeAllex(modulename, nsdescfetcherfunc){
    var resultobj;

    if (modulename.match (GITURLREGEXP)) {
      return qnull;
    }
    var resultobj, _index, username, aliasdata, suffices, namespace;
    if(!modulename){
      return qnull;
    }

    if (modulename.indexOf(':') > -1) {
      return q(shortNotationExpander(modulename, nsdescfetcherfunc));
    } 

    _index = modulename.indexOf('_');
    if (_index < 1) return qnull;
    username = modulename.substring (0, _index);
    _index = modulename.indexOf('__');
    if (_index < 1) {
      namespace = null;
    } else {
      namespace = modulename.substring(_index+2, modulename.lastIndexOf('_'));
    }
    return qlib.promise2decision(
      nsdescfetcherfunc(username, namespace, null),
      onNSSuffices.bind(null, modulename)
    );
  }

  function onNSSuffices (modulename, suffices) {
    var resultobj;
    resultobj = {result: null, matchlen: 0};
    suffices.reduce(checkForSuffix.bind(null, modulename, modulename+'s'), resultobj);
    return resultobj.result;
  }

  return recognizeAllex;

}

module.exports = createModuleRecognition;
