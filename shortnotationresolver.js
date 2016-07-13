function createShortNotationExpander (getAlias) {
  'use strict';
  var DEFAULT_SUFFIX = 'service';

  function expand (short_name, default_suffix) {
    default_suffix = default_suffix || DEFAULT_SUFFIX;
    var arr1 = short_name.split(':'),
      alias = arr1[0],
      name = alias+'_',
      type = arr1[2] ? arr1[2] : default_suffix,
      namespace = null;

   if (arr1.length < 2) return null;

    var cn = arr1[1], 
      gindex = cn.indexOf('_'),
      group = null;

    if (gindex > -1) {
      name+= '_';
      namespace = cn.slice(0, gindex);
    }

    group = namespace ? alias+'_'+namespace+'_'+type+'s': alias+'_'+type+'s';
    name += arr1[1]+type;
    cn = namespace ? cn.slice(gindex+1) : cn;

    return {
      modulename : name,
      servicename: cn,
      type : type,
      alias: alias,
      group: group,
      namespace: namespace ? namespace : undefined,
      git : getAlias(alias).git+group+'/'+cn
    };
  }

  return expand;
}

module.exports = createShortNotationExpander;
