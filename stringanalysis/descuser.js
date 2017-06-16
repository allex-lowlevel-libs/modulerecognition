'use strict';

function gitsshnpmstring (desc, reponame) {
  return 'git+ssh://'+desc.user+'@'+desc.server+'/'+desc.repogroup+'/'+reponame+'.git';
}

function gitclonestring (desc, reponame) {
  return desc.user+'@'+desc.server+':'+desc.repogroup+'/'+reponame+'.git';
}

module.exports = {
  gitsshnpmstring: gitsshnpmstring,
  gitclonestring: gitclonestring
}
