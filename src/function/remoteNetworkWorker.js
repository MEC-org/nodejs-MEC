const keys = require('../appStructure/keyElements').keyElements,
     utils = require('../utils/utils');

function getNetworks() {
  return new Promise((resolve,reject)=>{
    let response = [];
    const obj = keys.setup.Getter;

    obj.methods.getAllNets()
    .call({
      from: "0x3d41d04f27efe6e837dce30f3412f98c9ade47ef"
    })
    .then(nets => {

      if(!nets.length) console.log("[ERROR] Something goes wrong, no nets found!");
      if(nets.length == 1) {
        prepeareNetworksObject(nets[0]).then(lastAVnet=>{
          response.push(lastAVnet);
        });
      }
      else if(nets.length != 1) {
        const check = () => {
          if(response.length == nets.length)
            resolve(response);
          else  
            return false;
        }
        for(let i=0; i<nets.length; i++) {
          prepeareNetworksObject(nets[i])
          .then(lastAVnet => {
            response.push(lastAVnet);
            check();
          })
          .catch((err)=>{
            console.log("[ERROR] Something goes wrong: %s", err);
          })
        }
      }
    })
    .catch(err => {
      reject(err);
    })
  });
}
  
/* Getting only 1 network */
function search(name) {
  return new Promise((resolve,reject)=>{
    keys.setup.Getter.methods.getUserEnodeUrl(utils.asciiToHex(name), '0x3d41d04f27efe6e837dce30f3412f98c9ade47ef')
    .call({
      from: "0x3d41d04f27efe6e837dce30f3412f98c9ade47ef"
    })
    .then(res => {
      setNewAvailableNetwork(res, name)
      .then(ANobj=>{
        resolve(ANobj);
      })
      .catch(err=>{ reject(err); });
    })
    .catch(err => {
      reject(err);
    })
  });
}

function getInterface() {
  return new Promise((resolve,reject)=>{
    getNetworks()
    .then(net=>{
      resolve(net);
    })
    .catch(error => {
      reject(error);
    })
  });
}

function prepeareNetworksObject(net) {
  return new Promise((resolve,reject)=>{
    keys.setup.Getter.methods.getUserEnodeUrl(net, "0x3d41d04f27efe6e837dce30f3412f98c9ade47ef")
    .call({
      from: "0x3d41d04f27efe6e837dce30f3412f98c9ade47ef"
    })
    .then(node => {
      const name = utils.fromHex(net);
      setNewAvailableNetwork(node, name)
      .then(ANobj=>{
        resolve(ANobj);
      })
      .catch(err=>{ reject(err); })
    })
    .catch(err => {
      reject(err);
    });
  });
}

function setNewAvailableNetwork(node, name) {
  return new Promise((resolve,reject)=>{
    keys.AVAILABLE_NETWORKS
    .push({
      name: name,
      enode: utils.fromHex(node),
    });
    const obj = keys.AVAILABLE_NETWORKS;
    console.log(`[INFO] Successfully added new "${name}" network`);
    resolve(obj[obj.length-1]);
  });
}

module.exports = {
  getInterface,
  search
}