const keys = require('../appStructure/keyElements.js').keyElements,
      fs   = require('fs'),
      Q_config = require('../Quorum/config');

function Storage(chain) {
  return new Promise((resolve,reject)=>{
    fs.access(`./Blockchain/${chain}`, (err)=>{
      if(!err) {
        console.log(`[INFO] Blockchain storage for "${chain}" network found\n`);
        resolve(true);
      }
      else {
        console.log('[WARN] Blockchain data folder not found' + '\n');
        reject(false);
      }
    });
  });
}

const asciiToHex = function (str) {
  return keys.infura.utils.asciiToHex(str);
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

/**
 * TODO: make it with pinging ports
 */
function allocateFreePorts() {
  ++Q_config.ports.gethNode;
  ++Q_config.ports.gethNodeRPC;
  ++Q_config.ports.gethNodeWS_RPC;
  ++Q_config.ports.raftHttp;
  ++Q_config.ports.devp2p;
  ++Q_config.ports.constellation;
  ++Q_config.chainId;
}

module.exports = {
	fromHex,
	Storage,
  nameToEnode,
  nodeToName,
  asciiToHex,
  allocateFreePorts
}