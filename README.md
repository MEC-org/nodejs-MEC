# nodejs-MEC
The official repository for mec npm package. The mec package is designed to quickly deploy a MEC client in a nodejs application and quickly integrate with any service from a decentralized MEC network

# Use-case
## Searching for specific blockchain sub-network:
```JavaScript
const mec = require('mec')

mec.init()

mec.startLayer.search("signup")
```
### Response contains interface needed to start new sub-network connection:
```JSON
> Object {
  name: "signup",
  enode: "enode://b61f72cb88eed0ea9c2214492186a473774a8a9bb3…38cc9d0230a81d8fde59724ea313fa@212.20.41.42:30303",
  address: "0xeac784b35b697740a3dc17ec59247749cc298c37",
  abi: [
    0: Object {
      constant:true,
      inputs:Array[0],
      name:"abidata",
      outputs:Array[1],
      payable:false,
      stateMutability:"view",
      type:"function"
    }, 
    1: { ... },
    2: { ... }
```

## Globaly available sub-networks
```JavaScriptJavaScript
mec.startLayer.getInterface()
```
### Response contains all available sub-networks interfaces:
```JSON
> []
  [Object, Object]
  0: { 
    abi: Array[3],
    address: "0xeac784b35b697740a3dc17ec59247749cc298c37",
    enode: "enode://b61f72cb88eed0ea9c2214492186a473774a8a9bb318194ac38d3900062a11a0b48d1a4e8d36e04432c2e287e485f2f30a38cc9d0230a81d8fde59724ea313fa@212.20.41.42:30303",
    name: "signup"
  }
  1: {
    abi: Array[3],
    address: "0x1234567890123456789012345678901234567890",
    enode: "enode://.....",
    name: "main"
  }
```
## Starting new connection
```JavaScript
mec.startLayer.start("signup", 1092015)
```
### Successfull response means that now you can interact with sub-network applications over http/ipc/API
