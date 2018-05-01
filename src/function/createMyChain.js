const m = require('../utils/Makers.js')
const k = require('../appStructure/keyElements.js').keyElements
const s = require('../function/startChain.js')
const c = require('../utils/connectConsortium.js')
const u = require('../utils/utils.js')
const g = require('../utils/connectUserData.js')
const conf = require('../Quorum/config.js')

function createMyChain(name) {
	return new Promise((resolve,reject) => {
		let chain = new m.SemiPrivateChain(name)
		chain.setup().then(() => {
			let path 	= `./Blockchain/${name}/./geth.ipc`;
			k.ipc[name] = s.setIpcProvider(path)
		})
			// c.connectConsortium(
			// 	c.consortium_params(
			// 		u.nameToEnode(name),
			// 		name,
			// 		k.ports,
			// 		`http://localhost:${k.ports}`
			// 	).then(done => {
			// 		setNodePublic(name, u.nameToEnode(name))
			// 			.then(done => { resolve(true) })
			// 			.catch(err => { reject(err) })
			// 	})
			// )
	});
}

function setNodePublic(name, url) {
	return new Promise(function(resolve, reject) {
		let G = new g();
		G.setNode(name, url)
			.then(done => { resolve(true) })
			.catch(err => { reject(err) })
	});
}

module.exports = {createMyChain}
