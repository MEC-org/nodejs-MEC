const keys = require('../appStructure/keyElements.js');
const fs = require('fs');

function Storage(chain) {
  return new Promise((resolve,reject)=>{
    fs.access('.chainData/./' + chain, (err)=>{
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


let fromHex = function(hexx) {
  // return keys.infura.toAscii(str)
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str.replace(/\u0000/g, '');
}

module.exports = {
	fromHex,
	Storage
}