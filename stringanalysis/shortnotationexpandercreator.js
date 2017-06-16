function createShortNotationExpander (q, qlib) {
  'use strict';
  var DEFAULT_SUFFIX = 'service',
    descuserlib = require('./descuser');

  function expand (short_name, nsdescfetcherfunc) {
    var arr1 = short_name.split(':'),
      username = arr1[0],
      name = username+'_',
      group = arr1[2] ? arr1[2] : DEFAULT_SUFFIX,
      namespace = null,
      ret;

   if (arr1.length < 2) return q(null);

    var cn = arr1[1], 
      gindex = cn.indexOf('_');

    if (gindex > -1) {
      name+= '_';
      namespace = cn.slice(0, gindex);
    }

    //group = namespace ? username+'_'+namespace+'_'+type+'s': username+'_'+type+'s';
    name += arr1[1]+group;
    group += 's';
    cn = namespace ? cn.slice(gindex+1) : cn;
    ret = {
      modulename : name,
      reponame: cn,
      username: username,
      group: group,
      namespace: null,
      npmstring: null
    };

    return qlib.promise2decision(nsdescfetcherfunc(username, namespace, group), onNSDesc.bind(null, ret));
  }

  function onNSDesc (ret, nsdesc) {
    if (!nsdesc) {
      return null;
    }
    ret.namespace = nsdesc.namespace;
    switch(nsdesc.type) {
      case 'git':
        ret.npmstring = descuserlib.gitsshnpmstring(nsdesc, ret.reponame);
        ret.gitclonestring = descuserlib.gitclonestring(nsdesc, ret.reponame);
        return ret;
      default:
        return null;
    }
  }

  return expand;
}

module.exports = createShortNotationExpander;
