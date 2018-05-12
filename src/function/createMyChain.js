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
		u.allocateFreePorts();
		chain.setup().then(() => {
			const path 	= `./Blockchain/${name}/./geth.ipc`;
			k.ipc[name] = s.setIpcProvider(path);

			setNewAvailableNetwork().then(network => {
				console.log(network);
			});

			c.connectConsortium(
				c.consortium_params(
					u.nameToEnode(name),
					name,
					Q_config.ports.gethNodeRPC,
					`http://localhost:${Q_config.ports.gethNodeRPC}`
				).then(done => {
					setNodePublic(name, u.nameToEnode(name))
						.then(done => { resolve(true); })
						.catch(err => { reject(err); })
				})
			);

		});
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

function setNewAvailableNetwork(name) {
  return new Promise((resolve,reject)=>{
    k.AVAILABLE_NETWORKS
    .push({
      name: conf.identity.nodeName,
      enode: conf.setup.enodeList,
    });
    const obj = k.AVAILABLE_NETWORKS;
    resolve(obj[obj.length-1]);
  });
}

module.exports = {createMyChain}
