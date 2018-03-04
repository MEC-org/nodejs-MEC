const exec = require('child_process').exec;


var Eth = function(params) { 
  Eth.accounts = new Promise((resolve,reject)=>{
    accounts(params).then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((er)=>{
      reject(er);
    });
  });

  Eth.property = new Promise((resolve,reject)=>{
    property().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.protocolVersion = new Promise((resolve,reject)=>{
    protocolVersion().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.coinbase = new Promise((resolve,reject)=>{
    coinbase().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.mining = new Promise((resolve,reject)=>{
    mining().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.hashrate = new Promise((resolve,reject)=>{
    hashrate().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.syncing = new Promise((resolve,reject)=>{
    syncing().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.gasPrice = new Promise((resolve,reject)=>{
    gasPrice().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.blockNumber = new Promise((resolve,reject)=>{
    blockNumber().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.getBalance = new Promise((resolve,reject)=>{
    getBalance().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.getStorageAt = new Promise((resolve,reject)=>{
    getStorageAt().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.getCode = new Promise((resolve,reject)=>{
    getCode().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.getTransactionByHash = new Promise((resolve,reject)=>{
    getTransactionByHash().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.getTransactionReceipt = new Promise((resolve,reject)=>{
    getTransactionReceipt().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.getTransactionCount = new Promise((resolve,reject)=>{
    getTransactionCount().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.sendRawTransaction = new Promise((resolve,reject)=>{
    sendRawTransaction().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.signTransaction = new Promise((resolve,reject)=>{
    signTransaction().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.sendTransaction = new Promise((resolve,reject)=>{
    sendTransaction().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.sign = new Promise((resolve,reject)=>{
    sign().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.call = new Promise((resolve,reject)=>{
    call().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.estimateGas = new Promise((resolve,reject)=>{
    estimateGas().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.getCompilers = new Promise((resolve,reject)=>{
    getCompilers().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.compileSolidity = new Promise((resolve,reject)=>{
    compileSolidity().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.compile = new Promise((resolve,reject)=>{
    compile().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.compileSerpent = new Promise((resolve,reject)=>{
    compileSerpent().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.submitWork = new Promise((resolve,reject)=>{
    submitWork().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.getWork = new Promise((resolve,reject)=>{
    getWork().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  Eth.getLogs = new Promise((resolve,reject)=>{
    getLogs().then((result)=>{
      let x = JSON.parse(result);
      for(var key in x){
        if(key == "result") resolve(x[key]);
      }
    })
    .catch((err)=>{
      reject(err)
    })
  });
  return true;
}


function accounts(params) {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_accounts", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((log)=>{
      resolve(log);
      // return log
    })
    .catch((err)=>{
      reject(err);
      // return err
    });
  });
}

function property() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_property", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function protocolVersion() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_protocolVersion", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function coinbase() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_coinbase", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function mining() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_mining", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function hashrate() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_hashrate", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function syncing() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_syncing", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function gasPrice() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_gasPrice", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function blockNumber() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_blockNumber", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function getBalance() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_getBalance", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function getStorageAt() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_getStorageAt", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function getCode() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_getCode", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function getTransactionByHash() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_getTransactionByHash", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function getTransactionReceipt() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_getTransactionReceipt", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function getTransactionCount() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_getTransactionCount", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function sendRawTransaction() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_sendRawTransaction", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function signTransaction() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_signTransaction", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function sendTransaction() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_sendTransaction", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function sign() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_sign", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function call() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_call", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function estimateGas() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_estimateGas", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function getCompilers() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_getCompilers", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function compileSolidity() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_compileSolidity", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function compile() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_compile", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function compileSerpent() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_compileSerpent", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function submitWork() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_submitWork", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function getWork() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_getWork", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}

function getLogs() {
  return new Promise((resolve,reject)=>{
    execute(`echo '{"jsonrpc":"2.0", "method":"eth_getLogs", "params":[], "id":${params.chainId}}' | nc -U ./${params.dataFolder}/./MEC.ipc`).then((result)=>{
      resolve(result);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}



function execute(command){
  return new Promise((resolve,reject)=>{
    exec(command, function(error, stdout, stderr){ 
      if(error) reject(error); 
      else if(stdout) resolve(stdout);
      else if(stderr) resolve(stderr);
    });
  });
}


module.exports = Eth
