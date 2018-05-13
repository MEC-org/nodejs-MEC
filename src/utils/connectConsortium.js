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
    
    console.log(`[INFO] Connecting consortium node with given params:`);
    console.log(params);

    chain = m.newWeb3Provider(params.server).eth;

    const old = keys.accounts.password,
          acc = Acc(chain, old, who);

    keys.accounts = acc;
    acc.my().then(account => {
  
      console.log(`\n[INFO] Account ${account} identified in "${who}" network`);    

      if(typeof(account) == 'undefined') {
        console.log(`[WARN] Accounts not found in "${who}" network`);
        /* THIS IS NOT GOOD FOR ACCOUNT CREATION */
        // acc.createAccount()
        // .then(r=>{ console.log(r); })
        // .catch(e=>{ console.log(e); });
      }
  
      acc.unlockAcc()
      .then(() => {
        console.log(`[INFO] Account successfully unlocked`);
      })
      .catch(e => { console.log(e); })
    });
  });
}

module.exports = {
  consortium_params,
  connectConsortium
}
