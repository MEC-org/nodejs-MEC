/* * * * * * * * * * * * * * *  * * * * * * * * * * 
  This function must copy keyfile to new chain folder
  in order to import account to new sub-net
 * * * * * ** * * * * * * * * * * * * * * * *  * * */
var ncp = require('ncp').ncp;
const k = require('../appStructure/keyElements.js')

let accounts;

ncp.limit = 16;

function importAccount(newChain) {
  ncp(
    `.chainData/signup/keystore/`,
    `.chainData/${newChain}/keystore/`,
    (err)=>{ 
      if(err) return console.log(err) 
      else console.log(`INFO:Successfully imported accounts to ${newChain}`)
    }
    );
}

function createAccount(ipc) {
  return new Promise((resolve,reject)=>{
    ipc.personal.newAccount("1234",(e,r)=>{
      if(r) resolve(r);
      else reject(e);
    });
  });
}

function unlockAcc(ipc, acc, pass) {
  return new Promise((r,e)=>{
    ipc.personal.unlockAccount(acc, pass, (err,res)=>{
      if(err) {console.log(err); e(err);}
      else {
        console.log(res);
        ipc.settings.defaultAccount = acc;
        r(res);
      }
    })
  });
}

function myAcc(name) {
  return new Promise((r,e)=>{
    k.ipc[name].eth.accounts[0]((err,res)=>{
      if(err) e(err);
      else r(res);
    })
  })
}

module.exports = {
	createAccount,
	importAccount,
  unlockAcc,
  accounts
}