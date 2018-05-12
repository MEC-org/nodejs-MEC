const m = require('./Makers.js'),
   keys = require('../appStructure/keyElements.js').keyElements,
     Tx = require('./tx.js').TX,
    Acc = require('./accManag.js').Accounts,
    App = require('../function/appConfigs.js').APP;

let consortium_params = (node, network, ports, server)=>{
  return consortium_params = {
          node: node,
          network: network,
          port: ports,
          server: server,
        };
}

function getNetObjByName(name) {
  const AN = keys.AVAILABLE_NETWORKS;
  for (let i=0; i<AN.length; i++) {
    const val = AN[i].name;
    if(val == name) return AN[i];
  }
}

function connectConsortium(params) {
  return new Promise((r,e)=>{
    const who = params.network,
          net = getNetObjByName(who);
    console.log(params);


    chain = m.newWeb3Provider(params.server).eth;

    // periodic function do catch transaction and mine, valid for POW
    // p.listener(who)

    const old = keys.accounts.password,
          acc = Acc(chain, old, who);
    keys.accounts = acc;
    console.log(acc.my());

    if(typeof(acc.my()) == 'undefined') {
      acc.createAccount()
        .then(r=>{ console.log(r); })
        .catch(e=>{ console.log(e); });
    }

    acc.unlockAcc()
      .then(r=>{ console.log(r); })
      .catch(e=>{ console.log(e); })

    if(!params.node) {
      r(true);
    }

    keys.ipc[who].admin.addPeer(params.node, (err,res)=>{
      if(err) e(err);
      else {
        console.log(`INFO: Successfully connected to ${params.node}`);
        console.log(net.address);

        getConsortiumService(chain, net.address, net.abi)
          .then((service)=>{

            // Setting CUSTOM_NODE
            prepeareCustomNodeObject({
              name: who,
              chainClient: keys.ipc[who],
              service: service
            });

            // init new app class
            // initialize tx class
            const app = new App("signup"),
                   tx = new Tx(app),
                  rep = tx.use("name", '');
            console.log(`INFO: Successfully connected to ${rep}`);
            r(true);
        })
        .catch((err)=>{console.log(err)});
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

    const getter = chain.contract(abi).at(address);

    prepeareCustomNodeObject({
      name: 'getter',
      chainClient: chain,
      service: getter
    });

    const creator = ()=>{
      prepeareServiceObject()
        .then((res)=>{
          const abi = JSON.parse(res[0]);
          const app = chain.contract(abi).at(res[1]);
          setTimeout(()=>{ resolve(app); }, 500);
        })
        .catch((err)=>{ throw err });
    }

    creator();

  });
}

function prepeareServiceObject() {
  return new Promise((resolve,reject)=>{
    let abi, address;

    const getter = new App('getter'),
              tx = new Tx(getter);

    tx.use("_adr", '').then(addr=>{
      address =  addr;
    });
    tx.use('abidata', '').then(int=>{
      abi = int;
    });

    setTimeout(()=>{
      resolve([abi,address])
    }, 1000);

  });
}


module.exports = {
  consortium_params,
  connectConsortium
}
