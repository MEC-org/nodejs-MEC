let   config = require('./config.js')
const setup = config.setup
const newRaftNetwork = require('./newRaftNetwork.js')
const joinExistingRaft = require('./joinExistingRaftNetwork.js')

function run(){
  return new Promise((resolve, reject) => {
    console.log('[IP]', setup.localIpAddress)
    console.log('[NODE_NAME]', config.identity.nodeName)
    console.log('[COORDINATING_IP]', setup.remoteIpAddress)
    console.log('[CONSENSUS]', setup.consensus)
    console.log('[ROLE]', setup.role)
    console.log('[KEEP_FILES]', setup.keepExistingFiles)

    if(config.setup.consensus === 'raft'){
      if(config.setup.role === 'coordinator'){
        config.setup.automatedSetup = true
        newRaftNetwork.HandleStartingNewRaftNetwork(config.setup, function(err, result){
          if(err){console.log('ERROR:', err)} 
          console.log('[SetupFromConfig] All done. Leave this running, ideally inside screen')
          resolve(true)
        })
      } else if (config.setup.role === 'non-coordinator'){
        config.setup.automatedSetup = true
        joinExistingRaft.HandleJoiningRaftNetwork(config.setup, function(err, result){
          if(err){console.log('ERROR:', err)} 
          console.log('[SetupFromConfig] All done. Leave this running, ideally inside screen')
          resolve(true)
        })
      } else {
        console.log('Unsupported option:', config.setup.role)
        reject(false)
      }    
    } else {
      console.log('Only RAFT is supported')
      reject(false)
    }
  });
}

exports.run = run;
