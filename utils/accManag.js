/* * * * * * * * * * * * * * *  * * * * * * * * * * 
  This function must copy keyfile to new chain folder
  in order to import account to new sub-net
 * * * * * ** * * * * * * * * * * * * * * * *  * * */
var ncp = require('ncp').ncp;

ncp.limit = 16;

function importAccount(newChain) {
  ncp(
    `.chainData/main/keystore/`,
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

module.exports = {
	createAccount,
	importAccount
}