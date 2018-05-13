let ncp = require('ncp').ncp;
const k = require('../appStructure/keyElements.js').keyElements;

ncp.limit = 16;

class accounts {

  constructor(ipc, password, net) {
    this.web3 = ipc;
    this.password = password;
    this.node = k.ipc[net];
  }

  my() {
    return new Promise((resolve,reject) => {
      this.web3.getAccounts()
      .then(accounts => { resolve(accounts[0]); })
    });
  }

  createAccount() {
    return new Promise((resolve,reject)=>{
      this.node.personal.newAccount(this.password, (e,r)=>{
        console.log(e,r);
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
        if(err) return console.log(err);
        else console.log(`INFO:Successfully imported accounts to ${newChain}`);
      }
      );
  }

  unlockAcc() {
    return new Promise((r,e)=>{
      this.my()
      .then(account => {
      console.log(`[INFO] Unlocking account with given passphrase`)
      this.node.personal.unlockAccount(account, this.password, 3600, (err,res)=>{
        if(err) {
          e(err);
        }
        else {
          this.node.eth.defaultAccount = account;
          r(res);
        }
      });
      });
    });
  }
}

const Accounts = (ipc, password, net)=>{
  return new accounts(ipc, password, net);
}

module.exports = {
  Accounts
}
