# nodejs-MEC
The official repository for mec npm package. The mec package is designed to quickly deploy a MEC client in a nodejs application and quickly integrate with any service from a decentralized MEC network

# Use-case
## Searching for specific blockchain sub-network:
```JavaScript
const mec = require('mec')

// mec.layer.init(your_password), by default set to 1234
mec.layer.init("1234")

mec.layer.search("signup")
```
Response contains interface needed to start new sub-network connection:
```JSON
{
  "name": "signup",
  "enode": "enode://b61f72cb88eed0ea9c2214492186a473774a8a9bb3…38cc9d0230a81d8fde59724ea313fa@212.20.41.42:30303",
  "address": "0xeac784b35b697740a3dc17ec59247749cc298c37",
  "abi": [
    {
      "constant":true,
      "inputs":[0],
      "name":"abidata",
      "outputs":[1],
      "payable":false,
      "stateMutability":"view",
      "type":"function"
    }, 
    {},
    {}
  ]
}
```
### Globaly available sub-networks
```JavaScript
mec.layer.getInterface()
```
Response contains all available sub-networks interfaces:
```JSON
{
  "abi": [3], 
  "address": "0xeac784b35b697740a3dc17ec59247749cc298c37",
  "enode": "enode://b61f72cb88eed0ea9c2214492186a473774a8a9bb318194ac38d3900062a11a0b48d1a4e8d36e04432c2e287e485f2f30a38cc9d0230a81d8fde59724ea313fa@212.20.41.42:30303",
  "name": "signup"
},
{
  "abi": [3],
  "address": "0x1234567890123456789012345678901234567890",
  "enode": "enode://.....",
  "name": "main"
}
```
About abi you can read at [Ethereum ABI](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI).
### Starting new connection
```JavaScript
mec.layer.start("signup")
// mec.layer.start(name_of_subnet_you_connecting)
```
Successfull response means that now you can interact with sub-network applications over http/ipc/API
```
INFO: Successfully connected to enode://b61f72cb88eed0ea9c2214492186a473774a8a9bb318194ac38d3900062a11a0b48…d36e04432c2e287e485f2f30a38cc9d0230a81d8fde59724ea313fa@212.20.41.42:30303
INFO: Your address at signup network: 0xeac784b35b697740a3dc17ec59247749cc298c37
INFO: Ready: true
```
### Or your may create your own sub-network blockchain:
```JavaScript
mec.newLayer("my")
// the name you set will be used to find you globaly
```
Successfull response means that now you can develop or anything else with your own sub-network blockchain.
* at development newly created sub-networks can't be found outside your computer
 ```
INFO [03-04|13:09:18] Allocated cache and file handles         database="/home/bogdan/Desktop/MEC_APP/.chainData/my/geth/chaindata" cache=16 handles=16
INFO [03-04|13:09:18] Successfully wrote genesis state         database=chaindata                                                        hash=5ce27c…c8984e
INFO [03-04|13:09:18] Allocated cache and file handles database="/home/bogdan/Desktop/MEC_APP/.chainData/my/geth/lightchaindata" cache=16 handles=16
INFO [03-04|13:09:18] Successfully wrote genesis state         database=lightchaindata                                                        hash=5ce27c…c8984e

Successfully created new chain folder
INFO:Successfully imported accounts to my
{ node: undefined,
  network: 'my',
  port: 8545,
  server: 'http://localhost:8545' }
INFO: Your address at signup network: '0x66e42229ec5e5a940b5324757d106e0435c5f631'
INFO: Ready: true
 ```
### Instalation
```
npm install mec@0.1.0
```
Add MEC to your project
```JavaScript
const mec = require('mec')
mec.init("1234")
```
### [API reference](https://github.com/MEC-org/nodejs-MEC/wiki)
