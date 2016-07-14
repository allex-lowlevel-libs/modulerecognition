function createModuleRecognition (getAlias) {
  'use strict';
  var _allexprefix = 'allex_',
      _allexsuffices = ['service','parser','storage','lib'],
      shortNotationExpander = require('./shortnotationresolver')(getAlias);


  function checkForSuffix(repo, mmn,resultobj,suffix){
    var servicename, namespace, secondunderscorepos, group;
    if(mmn.lastIndexOf(suffix)===mmn.length-suffix.length){
      servicename = mmn.substring(repo.alias.length+1,mmn.length-suffix.length); //repo+1: incude '_' as well ...
      if(servicename.charAt(0)==='_'){
        secondunderscorepos = (servicename.substring(1)).indexOf('_');
        if(secondunderscorepos>0){
          secondunderscorepos++; //because of servicename's substring(1)
          namespace = servicename.substring(1,secondunderscorepos);
          servicename = servicename.substring(secondunderscorepos+1);
          group = repo.alias+'_'+namespace+'_'+suffix+'s';
        }
      }
      if(!group){
        group = repo.alias+'_'+suffix+'s';
      }


      resultobj.result = {
        modulename: mmn,
        alias: repo.alias,
        git : repo.git+group+'/'+servicename,
        group: group,
        servicename: servicename,
        type: suffix,
        namespace: namespace
      };
      return true;
    }
  }
  function recognizeAllex(missingmodulename, additional_suffices, default_suffix){
    var resultobj, _index, repo, aliasdata, suffices;
    if(!missingmodulename){
      return null;
    }

    if (missingmodulename.indexOf(':') > -1) {
      //TODO: ovaj nece proveravati suffix ... i da suffix bude blah, njemu ce to biti ok ... fer? mislim da ne ...
      return shortNotationExpander(missingmodulename, default_suffix);
    } 

    _index = missingmodulename.indexOf('_');
    if (_index < 1) return null;
    repo = missingmodulename.substring (0, _index);
    aliasdata = getAlias(repo);

    if (!aliasdata.git) return null;

    resultobj = {result:null};

    if (additional_suffices) {
      suffices = _allexsuffices.concat(additional_suffices);
    }else{
      suffices = _allexsuffices;
    }

    suffices.some(checkForSuffix.bind(null, aliasdata, missingmodulename,resultobj));
    return resultobj.result;
  }

  return recognizeAllex;

}

module.exports = createModuleRecognition;
