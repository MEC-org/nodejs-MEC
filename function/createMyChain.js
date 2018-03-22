const m = require('../utils/Makers.js')
const k = require('../appStructure/keyElements.js');
const s = require('../function/startChain.js')
const c = require('../utils/connectConsortium.js')
const u = require('../utils/utils.js')
const g = require('../utils/connectUserData.js')

// let chainId = 1092015;

function createMyChain(name) {
	return new Promise((resolve,reject)=>{
		m.Chain(name).then(res=>{
			k.ports++;
			k.discovery++;
			m.Client(name, k.chainId, k.ports, k.discovery, true).then(res=>{
				let path = `.chainData/${name}/./MEC.ipc`
				k.ipc[name] = s.setIpcProvider(path)
				c.connectConsortium(
			        c.consortium_params(
			          u.nameToEnode(name),
			          name,
			          k.ports,
			          `http://localhost:${k.ports}`
			        ).then(done => {
								setNodePublic(name, u.nameToEnode(name))
									.then(done => { resolve(true) })
									.catch(err => { reject(err) })
							})
			    )
			});
		})
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

module.exports={createMyChain}
