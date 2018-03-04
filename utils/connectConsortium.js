const m = require('./Makers.js')
const keys = require('../appStructure/keyElements.js');
const tx = require('./tx.js')
const manager = require('./accManag.js')
const p = require('../function/periodic.js')

let consortium_params = (node, network, ports, server)=>{
  return consortium_params = {
          node: node,
          network: network,
          port: ports,
          server: server,
        };
}

function getNetObjByName(name) {
  let AN = keys.AVAILABLE_NETWORKS;
  for (var i=0; i<AN.length; i++) {
    let val = AN[i].name
    if(val == name) return AN[i]
  }
}

function connectConsortium(params) {
  return new Promise((r,e)=>{

    let who = params.network;
    let net = getNetObjByName(who)

    chain = m.newWeb3Provider(params.server).eth;
    
    tx.init_tx(keys.ipc[who]);

    p.listener(who)

    let acc = chain.accounts;

    if(!acc.length) {
      manager.createAccount(keys.ipc[who])
        .then((r)=>{ console.log(r); })
        .catch((e)=>{ console.log(e) });
    }
    console.log(acc);

    keys.ipc[who].admin.addPeer(params.node, (err,res)=>{
      if(err) e(err);
      else {
        console.log(`INFO: Successfully connected to ${params.node}`);
        console.log(net.address)
        setTimeout(()=>{console.log(net.abi)}, 2000);
        getConsortiumService(chain, net.address, net.abi)
          .then((service)=>{
            tx.send_BC_tx(service,"name",'',0,1).then(name=>{
              console.log(name)
              prepeareCustomNodeObject({
                name:name, chainClient:chain, service:service
              });
              r(true)             
            })
        })
        .catch((err)=>{console.log(err)})
      }
    });

  });
}

function prepeareCustomNodeObject(data) {
  keys.CUSTOM_NODES.push({
    name: data.name,
    chainClient: data.chainClient,
    service: data.service
  });
}

function getConsortiumService(chain, address, abi) {
  return new Promise((resolve,reject)=>{

    let getter = chain.contract(abi).at(address);

    let creator = ()=>{
      prepeareServiceObject(chain, getter)  
        .then((res)=>{
          let abi = JSON.parse(res[0]);
          let app = chain.contract(abi).at(res[1]);
          setTimeout(()=>{resolve(app);}, 1000)
        })
        .catch((err)=>{ throw err });
    }

    creator();

  });
}

function prepeareServiceObject(net, getter) {
  return new Promise((resolve,reject)=>{
    let abi, address;

    // console.log(tx.send_BC_tx());
    tx.send_BC_tx(getter,"_adr", '', 0, 0).then(addr=>{
      address =  addr;
    });
    tx.send_BC_tx(getter,'abidata', '', 0, 1).then(int=>{
      abi = int;
    });

    setTimeout(()=>{
      resolve([abi,address])
    }, 100);

  });
}


module.exports = {
  consortium_params,
  connectConsortium
}