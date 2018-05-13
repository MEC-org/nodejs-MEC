const Web3Gen = require('../utils/Web3Generator.js'),
       makers = require('../utils/Makers.js'),
         keys = require('../appStructure/keyElements.js').keyElements,
         cons = require('../utils/connectConsortium.js'),
        utils = require('../utils/utils.js'),
     Accounts = require('../utils/accManag.js').Accounts,
     Q_config = require('../Quorum/config'),
           fs = require('fs');

// Main Ethereum Network
// Test Ethereum Network (Ropsten)
// Test Ethereum Network (Rinkeby)
// Test Ethereum Network (Kovan)
const infura_main = 'https://mainnet.infura.io/vsHV6WQMTF9hk5HOdoOx',
   infura_ropsten = 'https://ropsten.infura.io/vsHV6WQMTF9hk5HOdoOx',
   infura_rinkeby = 'https://rinkeby.infura.io/vsHV6WQMTF9hk5HOdoOx',
     infura_kovan = 'https://kovan.infura.io/vsHV6WQMTF9hk5HOdoOx';

keys.infura = Web3Gen.newRemoteProvider(infura_kovan);

/* * * * * * * * * * * * * * * * * * * * * *  * * * * * *
  By this function I'm getting from mainnet
  MEC Smart contract which contains networks ids
 * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init (password){
  const abi = require('../../build/contracts/Getter.json'),
        adr = '0x0f5deec9e85cddb24900efffe2b2acbf5a37ebb3';

  keys.setup.Getter = new keys.infura.eth.Contract(abi.abi);
  keys.setup.Getter._address = adr;

  keys.accounts = Accounts('', password, '');
  fs.writeFile(`./passwordfile`, password, (err) => {
    if(err)
      console.log(err);
    else {
      console.log(`[INFO] Initialization was successful`);
      return;
    }
  });
  fs.mkdir(`./Blockchain`, (err) => {
    if(err)
      console.log(err);
    else
      console.log(`[INFO] Blockchain space successfully prepeared`);
  })
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
        resolve(mes);
      })
      .catch((err)=>{
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
        reject(err);
      });
    });
  });
}

function initMEC(network, rpc) {
  return new Promise((resolve,reject)=>{

      const chain = new makers.SemiPrivateChain(network),
             path = `./Blockchain/${network}/./geth.ipc`;
      utils.allocateFreePorts();
      chain.setup().then(() => {
        
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
      })
      .catch(err => {
        reject(err);
      });
 
    });
}

module.exports = {
  init,
  start,
  setIpcProvider
}
