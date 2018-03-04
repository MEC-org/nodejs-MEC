const Web3Gen = require('../utils/Web3Generator.js');
const makers = require('../utils/Makers.js');

const keys = require('../appStructure/keyElements.js');
const cons = require('../utils/connectConsortium.js');
const tx = require('../utils/tx.js')
const utils = require('../utils/utils.js')


function eth(chainId, dataFolder) {
  let options = {
    chainId: chainId,
    dataFolder: dataFolder
  }
  new Eth(options)
}

let myChain;


// Main Ethereum Network
const infura_main = 'https://mainnet.infura.io/vsHV6WQMTF9hk5HOdoOx';

// Test Ethereum Network (Ropsten)
const infura_ropsten = 'https://ropsten.infura.io/vsHV6WQMTF9hk5HOdoOx';

// Test Ethereum Network (Rinkeby)
const infura_rinkeby = 'https://rinkeby.infura.io/vsHV6WQMTF9hk5HOdoOx';

// Test Ethereum Network (Kovan)
const infura_kovan = 'https://kovan.infura.io/vsHV6WQMTF9hk5HOdoOx';

// keys.infura = Web3Gen.newRemoteProvider(infura_main);
// let path = `http://localhost:${keys.ports}`
keys.infura = Web3Gen.newRemoteProvider(infura_kovan);
// keys.infura = makers.newWeb3Provider(path);

/* * * * * * * * * * * * * * * * * * * * * *  * * * * * *
  By this function I'm getting from mainnet 
  MEC Smart contract which contains networks ids
 * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 /* * * * * * * ** * * * * ** * * * * * * ** * * * * * * 
  Add functions to catch update event in subnet and
  rewrite CP.Getter variable with new ABI and address
  *  * * * * * * * * * * * * * * * * * * * * * * * * * * **/
function init (){
  if (!keys.lastSession.getterAddress) {
    let abi = require('../build/contracts/MEC.json');
    let getter = keys.infura.eth.contract(abi);
    keys.CP.Getter = getter.at('0xce3420889e6e07a44b96cc34371b4a72bded8223');
    // resolve(true);
  } else {
    let getter = keys.infura.eth.contract(lastSession.getterABI);
    keys.CP.Getter = getter.at(lastSession.getterAddress);
    // resolve(true);
  }
}

function getNetworks() {
  return new Promise((resolve,reject)=>{
    let obj = keys.CP.Getter;
    let response = [];
    var nets =[];

    obj.get_all_nets((err,nets)=>{

      if(!nets.length) console.log("Something goes wrong, no nets found!")
      if(nets.length == 1) {
        // getNode()
        prepeareNetworksObject(nets[0]).then(lastAVnet=>{
          response.push(lastAVnet);
        });
      } else if(nets.length != 1) {
        let check = ()=>{
          console.log(response.length)
          if(response.length == nets.length) resolve(response);
          else return false
        }
        for(let i=0; i<nets.length; i++) {
          prepeareNetworksObject(nets[i]).then(lastAVnet=>{
            response.push(lastAVnet);
            check()
          })
           .catch((err)=>{
            console.log("ERROR: Something goes wrong: %s", err);
          })
        }
      }
    });
  });
}

/* Getting only 1 network */
function search(name) {
  return new Promise((resolve,reject)=>{
    keys.CP.Getter.get_node(name,0, (err,res)=>{
      setNewAvailableNetwork(res, name).then(ANobj=>{
        resolve(ANobj);
      })
      .catch(err=>{ reject(err) });
  });
  });
}

function getInterface() {
  return new Promise((resolve,reject)=>{
    getNetworks().then(net=>{
      resolve(net);
    });
  });
}

function prepeareNetworksObject(net) {
  // only for proto, later it will be with array 
  // prepeare for each network
  return new Promise((resolve,reject)=>{
    keys.CP.Getter.get_node(net, 0, (err,node)=>{
      if(err) reject(err);
      else {
        let name = utils.fromHex(net);
        setNewAvailableNetwork(node, name).then(ANobj=>{
          resolve(ANobj);
        })
        .catch(err=>{ reject(err) })
      }
    });
  });
}

function setNewAvailableNetwork(node, name) {
  return new Promise((resolve,reject)=>{
    let abitor = require('../build/contracts/Getter.json')
    keys.AVAILABLE_NETWORKS
      .push({
        name: name,
        enode: utils.fromHex(node[0]),
        address:node[1],
        abi:abitor
      });
    let obj = keys.AVAILABLE_NETWORKS
    resolve(obj[obj.length-1]);
  });
}

function setIpcProvider(path) {
  return Web3Gen.newIPCProvider(path);
}

function start(network, chainId) {
  return new Promise((resolve,reject)=>{
    utils.Storage(network).then(()=>{
      initMEC(network, chainId, true).then(()=>{
        
        resolve(true);
      })
      .catch((err)=>{
        console.log(err);
      });
    })
    .catch(()=>{
      makers.Chain(network).then(()=>{
        /*
          For newly created chains I must import account,
          wait until chain data will be ready and then continue
        */
        initMEC(network, chainId, true).then(()=>{
          resolve(true);
        })
        .catch((err)=>{
          console.log(err);
        })
      }) 
      .catch((err)=>{
        // add creation error window
        // error at blockchain initialization
        console.log(err);
      });
    });
  });
}

function initMEC(network, chainId, rpc) {
  return new Promise((resolve,reject)=>{
    if(rpc) {
      keys.ports++;
    }
    let ports = keys.ports;
    keys.discovery++;
    makers.Client(network, chainId, ports, keys.discovery, rpc)
    .then(()=>{
      let path = `.chainData/${network}/./MEC.ipc`

      keys.ipc[network] = setIpcProvider(path)

      cons.connectConsortium(
        cons.consortium_params(
          enode(network),
          network,
          ports,
          `http://localhost:${ports}`
        )
      )
      .then(()=>{
        resolve(true);
       })
      .catch((err)=>{
        console.log("ERROR: Some error with adding peer. Try to debug, input data: " + enode);
        reject(err);
      });
    });
  });
}

let enode = (name)=>{
  for(let i=0; i<keys.AVAILABLE_NETWORKS.length; i++) {
    if(keys.AVAILABLE_NETWORKS[i].name == name) {
      return keys.AVAILABLE_NETWORKS[i].enode;
    }
  }
}


module.exports = {
  init,
  getNetworks,
  getInterface,
  // prepeareNetworksObject,
  setIpcProvider,
  start,
  search,
  enode,
  eth
}