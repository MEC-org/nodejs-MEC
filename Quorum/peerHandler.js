let events = require('./eventEmitter.js');

let enodeList = []

function listenForNewEnodes(result, cb){
  let web3IPC = result.web3IPC
  events.on('newEnode', function(enode){
    if(enodeList.indexOf(enode) < 0){
      enodeList.push(enode)
      web3IPC.admin.addPeer(enode, function(err, res){
        if(err){console.log('ERROR:', err)}
      })
    }
  })
  cb(null, result)
}

exports.ListenForNewEnodes = listenForNewEnodes
