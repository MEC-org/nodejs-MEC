var infura,
    ports,
    discovery;

var ipc = []

ports = 8544;
discovery = 30302;


const txpool = {

}

let AVAILABLE_NETWORKS = [];

let CP = {
  Getter: '',
  Current: ''
}

let CUSTOM_NODES = []

// let node = {
//   id: '',
//   gas: 100000000,
//   account: '',
//   adminPage: '',
//   localId:'',
//   localChainId: '',
//   localChainAccount:'',
// }

let lastSession = {
  getterAddress:'',
  getterABI: ''
};

module.exports = {
	txpool,
	AVAILABLE_NETWORKS,
	CP,
	CUSTOM_NODES,
	lastSession,
	infura,
	ipc,
	ports,
	discovery
}