var ncp = require('ncp').ncp;
const k = require('../appStructure/keyElements.js')

ncp.limit = 16;

class accounts {

  constructor(ipc, password, net) {
    this.web3 = ipc;
    this.password = password;
    this.node = k.ipc[net];
  }

  my() {
    return this.web3.accounts[0];
  }

  createAccount() {
    return new Promise((resolve,reject)=>{
      this.node.personal.newAccount(this.password, (e,r)=>{
        console.log(e,r)
        if(r) resolve(r);
        else reject(e);
      })
    });
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * *
  This function must copy keyfile to new chain folder
  in order to import account to new sub-net
  * * * * * * * * * * * * * * * * * * * * * * * * * */
  importAccount(newChain) {
    ncp(
      `./Blockchain/signup/keystore/`,
      `./Blockchain/${newChain}/keystore/`,
      (err)=>{
        if(err) return console.log(err)
        else console.log(`INFO:Successfully imported accounts to ${newChain}`)
      }
      );
  }

  unlockAcc() {
    return new Promise((r,e)=>{
      this.node.personal.unlockAccount(this.my(), this.password, (err,res)=>{
        if(err) {console.log(err); e(err);}
        else {
          console.log(res);
          this.node.settings.defaultAccount = this.my();
          r(res);
        }
      })
    });
  }
}

let Accounts = (ipc, password, net)=>{
  return new accounts(ipc, password, net)
}

module.exports = {
	// createAccount,
	// importAccount,
  // unlockAcc,
  Accounts
}
