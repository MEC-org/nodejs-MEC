const keys = require('../appStructure/keyElements.js').keyElements,
      fs   = require('fs');

function Storage(chain) {
  return new Promise((resolve,reject)=>{
    fs.access(`./Blockchain/${chain}`, (err)=>{
      if(!err) {
        console.log('The blockchain data folder successfully found' + '\n');
        resolve(true);
      }
      else {
        console.log('WARN: Blockchain data folder not found' + '\n');
        reject(false);
      }
    });
  });
}


const fromHex = function(hexx) {
  // return keys.infura.toAscii(str)
  const hex = hexx.toString();//force conversion
  let str = '';
  for (let i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str.replace(/\u0000/g, '');
}

const nameToEnode = (name)=>{
  for(let i=0; i<keys.AVAILABLE_NETWORKS.length; i++) {
    if(keys.AVAILABLE_NETWORKS[i].name == name) {
      return keys.AVAILABLE_NETWORKS[i].enode;
    }
  }
}

const nodeToName = (node)=>{
  for(let i=0; i<keys.AVAILABLE_NETWORKS.length; i++) {
    if(keys.AVAILABLE_NETWORKS[i].enode == node) {
      return keys.AVAILABLE_NETWORKS[i].name;
    }
  }
}

module.exports = {
	fromHex,
	Storage,
  nameToEnode,
  nodeToName
}