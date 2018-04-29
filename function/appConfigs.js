const k = require('../appStructure/keyElements.js').keyElements

class APP {

  constructor(chain) {
  	this.app = k.CUSTOM_NODES[chain].service;
  }

  howTo (method) {
	return getAbi(this.app.abi, method);
  }
}

let getAbi = (from, name) => {
	for(let i=0; i<from.length; i++) {
		if(from[i].name == name) return from[i]
	}
}

let CLI = (name)=>{
  let CN = k.CUSTOM_NODES[name];
  return CN.chainClient 
}

module.exports = {
	APP,
	CLI
}