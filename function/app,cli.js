const k = require('../appStructure/keyElements.js')

let APP = (name)=>{
  let CN = k.CUSTOM_NODES[name];
  return CN.service
}

let CLI = (name)=>{
  let CN = k.CUSTOM_NODES[name];
  return CN.chainClient 
}

module.exports = {
	APP,
	CLI
}