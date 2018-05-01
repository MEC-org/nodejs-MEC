const web3_extended = require('web3_ipc');
const Web3 = require('web3');


function newRemoteProvider(host) {
	let web3 = new Web3();
	// web3.setProvider(new Web3.providers.HttpProvider(infura_main)):
	web3.setProvider(new Web3.providers.HttpProvider(host));
	return web3;	
}

function newIPCProvider(path) {
	let options = {
		host: path,
		ipc: true,
		personal: true, 
		admin: true,
		miner:true,
		debug: false
		};
	let web3 = web3_extended.create(options);
	return web3;
}

module.exports = {
	newRemoteProvider,
	newIPCProvider
}
