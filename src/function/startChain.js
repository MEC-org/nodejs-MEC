const Web3Gen = require('../utils/Web3Generator.js'),
       makers = require('../utils/Makers.js'),
         keys = require('../appStructure/keyElements.js').keyElements,
         cons = require('../utils/connectConsortium.js'),
           tx = require('../utils/tx.js'),
        utils = require('../utils/utils.js'),
     Accounts = require('../utils/accManag.js').Accounts,
            Q = require('../Quorum/setupFromConfig.js');

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
    const abi = require('../build/contracts/Getter.json'),
          adr = '0x1f3BC2890Fa90128490e1c695866f6de48D1d455';

    keys._INIT.Getter = new keys.infura.eth.Contract(abi,adr);

    keys.accounts = Accounts('', "password", '');
    return;
}

function getNetworks() {
  return new Promise((resolve,reject)=>{
    let response = [];
    const obj = keys._INIT.Getter;

    obj.getAllNets((err,nets)=>{

      if(!nets.length) console.log("Something goes wrong, no nets found!");
      if(nets.length == 1) {
        // getNode()
        prepeareNetworksObject(nets[0]).then(lastAVnet=>{
          response.push(lastAVnet);
        });
      } else if(nets.length != 1) {
        const check = ()=>{
          console.log(response.length)
          if(response.length == nets.length)
            resolve(response);
          else
            return false;
        }
        for(let i=0; i<nets.length; i++) {
          prepeareNetworksObject(nets[i])
          .then(lastAVnet=>{
            response.push(lastAVnet);
            check();
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
    keys._INIT.Getter.getUserEnodeUrl(name, '0x77e3e57ed18f7e3578215d6c45f246749975a2d9', (err,res)=>{
      setNewAvailableNetwork(res, name)
      .then(ANobj=>{
        resolve(ANobj);
      })
      .catch(err=>{ reject(err); });
  });
  });
}

function getInterface() {
  return new Promise((resolve,reject)=>{
    getNetworks()
    .then(net=>{
      resolve(net);
    });
  });
}

function prepeareNetworksObject(net) {
  // only for proto, later it will be with array
  // prepeare for each network
  return new Promise((resolve,reject)=>{
    keys._INIT.Getter.getUserEnodeUrl(net, '0x77e3e57ed18f7e3578215d6c45f246749975a2d9', (err,node)=>{
      if(err) reject(err);
      else {
        const name = utils.fromHex(net);
        setNewAvailableNetwork(node, name)
        .then(ANobj=>{
          resolve(ANobj);
        })
        .catch(err=>{ reject(err); })
      }
    });
  });
}

function setNewAvailableNetwork(node, name) {
  return new Promise((resolve,reject)=>{
    const abitor = require('../build/contracts/Getter.json');
    keys.AVAILABLE_NETWORKS
    .push({
      name: name,
      enode: utils.fromHex(node[0]),
      address:node[1],
      abi:abitor
    });
    const obj = keys.AVAILABLE_NETWORKS;
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
      initMEC(network, keys.chainId, true)
      .then(mes=>{
        console.log(mes);
        resolve(mes);
      })
      .catch((err)=>{
        console.log(err);
      });
    })
    .catch(()=>{
      makers.Chain(network)
      .then(()=>{
        /*
          For newly created chains I must import account,
          wait until chain data will be ready and then continue
        */
        initMEC(network, keys.chainId, true)
        .then(mes=>{
          resolve(mes);
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
    // if(rpc) {
    //   keys.ports++;
    // }
    // let ports = keys.ports;
    // keys.discovery++;
    // makers.Client(network, chainId, ports, keys.discovery, rpc)
    // .then(()=>{
      const chain = new makers.SemiPrivateChain(network),
             path = `./Blockchain/${network}/./geth.ipc`;
      chain.setup();

      keys.ipc[network] = setIpcProvider(path);

      cons.connectConsortium(
        cons.consortium_params(
          utils.nameToEnode(network),
          network,
          ports,
          `http://localhost:${ports}`
        )
      )
      .then(mes=>{
        resolve(mes);
       })
      .catch((err)=>{
        console.log("ERROR: Some error with adding peer. Try to debug, input data: " + enode);
        reject(err);
      });
    });
  // });
}

module.exports = {
  init,
  getInterface,
  start,
  search,
  setIpcProvider
}
