let whisper = require('./Communication/whisperNetwork.js')
let util = require('./util.js')

let processedAccounts = []

function accountDiff(arrayA, arrayB){
  let arrayC = []
  for(let i in arrayA){
    let itemA = arrayA[i]
    let found = false
    for(let j in arrayB){
      let itemB = arrayB[j]
      if(itemA === itemB){
        found = true
      }
    }
    if(found === false){
      arrayC.push(itemA)
    }
  }
  return arrayC
}

function lookAtBalances(result, cb){
  if(util.IsWeb3RPCConnectionAlive(result.web3HttpRPC)){
    let thresholdBalance = 0.1

    let commWeb3WSRPC = result.communicationNetwork.web3WSRPC
    let web3HttpRPC = result.web3HttpRPC
    web3HttpRPC.eth.getAccounts(async function(err, allAccounts) {
      if(err) {console.log("ERROR:", err)}
      let accounts = accountDiff(allAccounts, processedAccounts)

      for(let i in accounts){
        let account = accounts[i]
        let amount = (await web3HttpRPC.eth.getBalance(account)).toString()
        //console.log("AMOUNT: ", amount)
        let balance = web3HttpRPC.utils.fromWei(amount, 'ether')
        // if balance is below threshold, request topup
        if(balance < thresholdBalance){
          whisper.RequestSomeEther(commWeb3WSRPC, account, function(err, res){
          })
        }  else {
          processedAccounts.push(account)
        }   
      }
      cb(true)
    });
  } else {
    cb(false)
  }
}

function monitorAccountBalances(result, cb){
  let web3HttpRPC = result.web3HttpRPC
  let intervalID = setInterval(function(){
    lookAtBalances(result, function(connectionAlive){
      if(connectionAlive == false){
        clearInterval(intervalID)
      }
    }) 
  }, 5*1000)
  cb(null, result)
}

exports.MonitorAccountBalances = monitorAccountBalances
