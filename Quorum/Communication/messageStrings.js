const delimiter = "|";

function buildDelimitedString(string1, string2) {
  if (string2.indexOf(delimiter) > -1) {
    console.log("ERROR: Message string contains " + delimiter + ", which is reserved for special use");
  }
  return string1 + delimiter + string2;
}

function appendData(string, data) {
  if (data.indexOf(delimiter) > -1) {
    console.log("ERROR: Message data contains " + delimiter + ", which is reserved for special use");
  }
  return string + data;
}

// TODO: this can be improved to take in some defaults for ttl and workToProve
// TODO: this can also perhaps have the option between an object with the parameters or 
// the individual parameters
function buildPostObject(topics, payload, ttl, workToProve, id) {
  postObj = { 
    JSON: {
      'topics': topics,
      'payload': payload,
      'ttl': ttl,
      'workToProve': workToProve
    },
    filterObject: buildFilterObject(topics)
  };
  if (id != undefined) {
    postObj.JSON.from = id
  }
  return postObj;
}

function buildFilterObject(topics) {
  let hexTopics = []
  for(let topic of topics){
    let hexString = '0x' + new Buffer(topic).toString('hex')
    hexString = hexString.substring(0, 10)
    hexTopics.push(hexString)
  }
  return {'topics': hexTopics}
}

request = {
  ether: buildDelimitedString('request', 'ether'),
  enode: buildDelimitedString('request', 'enode'),
  genesisConfig: buildDelimitedString('request', 'genesisConfig'),
  staticNodes: buildDelimitedString('request', 'staticNodes')
};

response = {
  ether: buildDelimitedString('response', 'ether'),
  enode: buildDelimitedString('response', 'enode'),
  genesisConfig: buildDelimitedString('response', 'genesisConfig'),
  staticNodes: buildDelimitedString('response', 'staticNodes')
};

publish = {
  nodeInfo: buildDelimitedString('publish', 'nodeInfo')
}

exports.BuildDelimitedString = buildDelimitedString;
exports.AppendData = appendData;
exports.BuildPostObject = buildPostObject;
exports.BuildFilterObject = buildFilterObject;
exports.Request = request;
exports.Response = response;
exports.Publish = publish;
