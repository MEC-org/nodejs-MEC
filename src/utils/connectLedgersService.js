/**
 * THIS STUFF NOT WORKING, ONLY CUTED IT FROM connectConsortium.js 
 */

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