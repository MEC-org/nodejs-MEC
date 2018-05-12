const m = require('../utils/Makers.js'),
	  k = require('../appStructure/keyElements.js').keyElements,
	  s = require('../function/startChain.js'),
	  c = require('../utils/connectConsortium.js'),
	  u = require('../utils/utils.js'),
	  g = require('../utils/connectUserData.js'),
   conf = require('../Quorum/config.js');

function createMyChain(name) {
	return new Promise((resolve,reject) => {
		const chain = new m.SemiPrivateChain(name);
		chain.setup().then(() => {
			const path 	= `./Blockchain/${name}/./geth.ipc`;
			k.ipc[name] = s.setIpcProvider(path);
		});
    c.connectConsortium(
      c.consortium_params(
        u.nameToEnode(name),
        name,
        k.ports,
        `http://localhost:${k.ports}`
      ).then(done => {
        setNodePublic(name, u.nameToEnode(name))
          .then(done => { resolve(true); })
          .catch(err => { reject(err); })
      })
    )
	});
}

function setNodePublic(name, url) {
	return new Promise(function(resolve, reject) {
		const G = new g();
		G.setNode(name, url)
			.then(done => { resolve(true); })
			.catch(err => { reject(err); })
	});
}

module.exports = {createMyChain}
