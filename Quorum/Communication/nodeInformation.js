const fs = require('fs')

const util = require('../util.js')
var config = require('../config.js')

var whisperUtils = require('./whisperUtils.js')
var messageString = require('./messageStrings.js')
var publish = messageString.Publish

var networkNodesInfo = {}

// TODO: Add to and from fields to validate origins
function publishNodeInformation(result, cb){

  let web3HttpRPC = result.web3HttpRPC;
  let shh = result.communicationNetwork.web3WSRPC.shh;

  var c = result.constellationConfigSetup
  let filePath =  c.folderName+'/'+c.publicKeyFileName
  let constellationPublicKey = fs.readFileSync(filePath, 'utf8')
  let nodeInformationPostIntervalID = null
  let accountList = web3HttpRPC.eth.accounts

  whisperUtils.getAsymmetricKey(shh, function(err, id) {
    let nodeInfo = {
      whisperId: id,
      nodePubKey: result.nodePubKey,
      ipAddress: result.localIpAddress,
      nodeName: config.identity.nodeName,
      address: accountList[0],
      constellationPublicKey: constellationPublicKey
    }
       
    let message = messageString.BuildDelimitedString(publish.nodeInfo, JSON.stringify(nodeInfo))
    whisperUtils.postAtInterval(message, shh, 'NodeInfo', 10*1000, function(err, intervalID) {
      if(err){console.log('nodeInformation postAtInterval ERROR:', err)}
      nodeInformationPostIntervalID = intervalID
    });

    function onData(msg) {
      let message = null
      if(msg && msg.payload){
        message = util.Hex2a(msg.payload)
      }
      if(message && message.includes(publish.nodeInfo)){
        let messageTokens = message.split('|')
        let receivedInfo = JSON.parse(messageTokens[2])
        let nodePubKey = networkNodesInfo[receivedInfo.nodePubKey]
        if(nodePubKey === undefined){
          networkNodesInfo[receivedInfo.nodePubKey] = receivedInfo
          fs.writeFile('networkNodesInfo.json', JSON.stringify(networkNodesInfo), function(err){ 
            if(err) { console.log('Writing networkNodesInfo ERROR:', err) }
          })
        } else {
          // This info is already present, no need to add to networkNodesInfo
        }
      }
    }

    whisperUtils.addBootstrapSubscription(["NodeInfo"], shh, onData)
    cb(null, result)
  });
}

exports.PublishNodeInformation = publishNodeInformation
