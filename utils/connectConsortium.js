const m = require('./Makers.js')
const keys = require('../appStructure/keyElements.js');
const Tx = require('./tx.js').TX
const manager = require('./accManag.js')
const p = require('../function/periodic.js')
const App = require('../function/appConfigs.js').APP

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
    console.log(params)

    let net = getNetObjByName(who)

    chain = m.newWeb3Provider(params.server).eth;

    p.listener(who)

    let acc = chain.accounts;
    
    manager.accounts = acc;

    if(!acc.length) {
      manager.createAccount(keys.ipc[who])
        .then(r=>{ console.log(r); })
        .catch(e=>{ console.log(e) });
    }
    console.log(acc);

    // last param - 43200 is 12h unlock 
    manager.unlockAcc(keys.ipc[who], acc[0], keys.CP.Password)
      .then(r=>{ console.log(r, "49") })
      .catch(e=>{ console.log(e) })

    if(!params.node) {
      r(true);
    }

    keys.ipc[who].admin.addPeer(params.node, (err,res)=>{
      if(err) e(err);
      else {
        console.log(`INFO: Successfully connected to ${params.node}`);
        console.log(net.address)
        
        getConsortiumService(chain, net.address, net.abi)
          .then((service)=>{

            // Setting CUSTOM_NODE
            prepeareCustomNodeObject({
              name: who,
              chainClient: keys.ipc[who],
              service: service
            });

            // init new app class
            let app = new App("signup");
            // initialize tx class
            let tx = new Tx(app)

            let rep = tx.use("name", '')
            console.log(`INFO: Successfully connected to ${rep}`)
            r(true);
        })
        .catch((err)=>{console.log(err)})
      }
    });

  });
}

function prepeareCustomNodeObject(data) {
  keys.CUSTOM_NODES[data.name] = {
    chainClient: data.chainClient,
    service: data.service
  };
}

function getConsortiumService(chain, address, abi) {
  return new Promise((resolve,reject)=>{

    let getter = chain.contract(abi).at(address);

    prepeareCustomNodeObject({
      name: 'getter',
      chainClient: chain,
      service: getter
    });

    let creator = ()=>{
      prepeareServiceObject()  
        .then((res)=>{
          let abi = JSON.parse(res[0]);
          let app = chain.contract(abi).at(res[1]);
          setTimeout(()=>{resolve(app);}, 500)
        })
        .catch((err)=>{ throw err });
    }

    creator();

  });
}

function prepeareServiceObject() {
  return new Promise((resolve,reject)=>{
    let abi, address;

    let getter = new App('getter')

    let tx = new Tx(getter)

    // console.log(tx.use());
    tx.use("_adr", '').then(addr=>{
      address =  addr;
    });
    tx.use('abidata', '').then(int=>{
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