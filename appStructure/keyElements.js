var infura,
    ports,
    discovery;

var ipc = []

ports = 8544;
discovery = 30302;
chainId = 1092015;

let accounts;

const txpool = {

}

let AVAILABLE_NETWORKS = [];


let _INIT = {
  Getter: '',
  Password: ''
}

let CUSTOM_NODES = []


module.exports = {
	txpool,
	chainId,
	AVAILABLE_NETWORKS,
  _INIT,
	CUSTOM_NODES,
	lastSession,
	infura,
	ipc,
	ports,
	discovery
}
