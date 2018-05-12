const Web3Gen = require('../utils/Web3Generator.js'),
       makers = require('../utils/Makers.js'),
         keys = require('../appStructure/keyElements.js').keyElements,
         cons = require('../utils/connectConsortium.js'),
           tx = require('../utils/tx.js'),
        utils = require('../utils/utils.js'),
     Accounts = require('../utils/accManag.js').Accounts,
            Q = require('../Quorum/setupFromConfig.js'),
     Q_config = require('../Quorum/config');

// Main Ethereum Network
// Test Ethereum Network (Ropsten)
// Test Ethereum Network (Rinkeby)
// Test Ethereum Network (Kovan)
const infura_main = 'https://mainnet.infura.io/vsHV6WQMTF9hk5HOdoOx',
   infura_ropsten = 'https://ropsten.infura.io/vsHV6WQMTF9hk5HOdoOx',
   infura_rinkeby = 'https://rinkeby.infura.io/vsHV6WQMTF9hk5HOdoOx',
     infura_kovan = 'https://kovan.infura.io/vsHV6WQMTF9hk5HOdoOx';

// keys.infura = Web3Gen.newRemoteProvider(infura_main);
// let path = `http://localhost:${keys.ports}`
keys.infura = Web3Gen.newRemoteProvider(infura_kovan);
// keys.infura = makers.newWeb3Provider(path);

/* * * * * * * * * * * * * * * * * * * * * *  * * * * * *
  By this function I'm getting from mainnet
  MEC Smart contract which contains networks ids
 * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 /* * * * * * * * * * * * * ** * * * * * * ** * * * * * *
  Add functions to catch update event in subnet and
  rewrite CP.Getter variable with new ABI and address
  *  * * * * * * * * * * * * * * * * * * * * * * * * * * **/
function init (password){
    const abi = require('../../build/contracts/Getter.json'),
          adr = '0x0f5deec9e85cddb24900efffe2b2acbf5a37ebb3';

    keys._INIT.Getter = new keys.infura.eth.Contract(abi.abi);
    keys._INIT.Getter._address = adr;

    keys.accounts = Accounts('', password, '');
    console.log(`[INFO] Initialization was successful`);
    return;
}

function getNetworks() {
  return new Promise((resolve,reject)=>{
    let response = [];
    const obj = keys._INIT.Getter;

    obj.methods.getAllNets()
    .call({
      from: "0x3d41d04f27efe6e837dce30f3412f98c9ade47ef"
    })
    .then(nets => {

      if(!nets.length) console.log("[ERROR] Something goes wrong, no nets found!");
      if(nets.length == 1) {
        // getNode()
        prepeareNetworksObject(nets[0]).then(lastAVnet=>{
          response.push(lastAVnet);
        });
      } else if(nets.length != 1) {
        const check = () => {
          // console.log(response.length)
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
      // console.log(err);
      reject(err);
    })
  });
}

/* Getting only 1 network */
function search(name) {
  return new Promise((resolve,reject)=>{
    keys._INIT.Getter.methods.getUserEnodeUrl(utils.asciiToHex(name), '0x3d41d04f27efe6e837dce30f3412f98c9ade47ef')
    .call({
      from: "0x3d41d04f27efe6e837dce30f3412f98c9ade47ef"
    })
    .then(res => {
      // console.log(res);
      setNewAvailableNetwork(res, name)
      .then(ANobj=>{
        resolve(ANobj);
      })
      .catch(err=>{ reject(err); });
    })
    .catch(err => {
      // console.log(err);
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
  // only for proto, later it will be with array
  // prepeare for each network
  return new Promise((resolve,reject)=>{
    keys._INIT.Getter.methods.getUserEnodeUrl(utils.asciiToHex(net), "0x3d41d04f27efe6e837dce30f3412f98c9ade47ef")
    .call({
      from: "0x3d41d04f27efe6e837dce30f3412f98c9ade47ef"
    })
    .then(node => {
      if(err) reject(err);
      else {
        const name = utils.fromHex(net);
        setNewAvailableNetwork(node, name)
        .then(ANobj=>{
          resolve(ANobj);
        })
        .catch(err=>{ reject(err); })
      }
    })
    .catch(err => {
      // console.log(err);
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

function setIpcProvider(path) {
  return Web3Gen.newIPCProvider(path);
}

function start(network) {
  return new Promise((resolve,reject)=>{
    utils.Storage(network)
    .then(()=>{
      initMEC(network, true)
      .then(mes=>{
        // console.log(mes);
        resolve(mes);
      })
      .catch((err)=>{
        // console.log(err);
      });
    })
    .catch(()=>{
      /*
        For newly created chains I must import account,
        wait until chain data will be ready and then continue
      */
      initMEC(network, true)
      .then(mes=>{
        resolve(mes);
      })
      .catch((err)=>{
        // console.log(err);
      });
    });
  });
}

function initMEC(network, rpc) {
  return new Promise((resolve,reject)=>{

      const chain = new makers.SemiPrivateChain(network),
             path = `./Blockchain/${network}/./geth.ipc`;
      utils.allocateFreePorts();
      chain.setup();

      keys.ipc[network] = setIpcProvider(path);

      cons.connectConsortium(
        cons.consortium_params(
          utils.nameToEnode(network),
          network,
          Q_config.ports.gethNodeRPC,
          `http://localhost:${Q_config.ports.gethNodeRPC}`
        )
      )
      .then(mes=>{
        resolve(mes);
       })
      .catch((err)=>{
        console.log("[ERROR] Some error with adding peer. Try to debug, input data: " + enode);
        reject(err);
      });
    });
}

module.exports = {
  init,
  getInterface,
  start,
  search,
  setIpcProvider
}
