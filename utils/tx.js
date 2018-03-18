const keys = require('../appStructure/keyElements.js')
const utils = require('./utils.js')

class TX {
  constructor(application) {
    this.app = application;
  }

  use (method, input) {
    return new Promise((resolve,reject)=>{
    EXEC_PROMISE_BC_METHOD(this.app, method, input)
      .then((result)=>{ resolve(result) })
      .catch((error)=>{ reject(error) });
  });
  }
}

// add checking WTF I am trying to execute through
// OBJ ABI. It have enough data, to detect weather correct
// method or correct input is executing
let EXEC_PROMISE_BC_METHOD = (service, method, input)=>{
  return new Promise((r,e)=>{
    // console.log(keys.accounts.my());
    if(input != '') {
      service.app[method](input, { from: keys.accounts.my() }, (err,res)=>{
        if(res) {
          let abi = service.howTo(method);
          // if user pass input but it don't needs
          if(!abi.inputs.length) e(`You passed input, but this method don't need`)
          console.log(`Inputs for ${abi.name} ${abi.inputs.length}`)
          console.log(`outputs for ${abi.name} ${abi.outputs.length}`)
          if(!abi.outputs.length) r(res);
          else {
            let out = abi.outputs;
            console.log(out)
            // if only 1 element at response
            if(out.length == 1) {
              r(prepeareResponse(out[0], res));

            } else {
              // if several elements at response
              let response = [];
              for(var i=0; i<out.length; i++){
                response.push(prepeareResponse(out[i], res[i]))
              }
              r(response)
            }
          }
        } else e(err)
      });
    } else {
      service.app[method]({ from: keys.accounts.my() }, (err,res)=>{
        if(res) {
          let abi = service.howTo(method);
          // if user pass input but it don't needs
          if(abi.inputs.length) e(`You passed no input, but this method required ${service.howTo(method).inputs}`)
          console.log(`Inputs for ${abi.name} ${abi.inputs.length}`)
          console.log(`outputs for ${abi.name} ${abi.outputs.length}`)
          if(!abi.outputs.length) r(res);
          else {
            let out = abi.outputs;

            // if only 1 element at response
            if(out.length == 1) {
              r(prepeareResponse(out[0], res));

            } else {
              // if several elements at response
              let response = [];
              for(var i=0; i<out.length; i++){
                response.push(prepeareResponse(out[i], res[i]))
              }
              r(response)
            }
          }
        } else e(err)
      });
    }
  });
}

let prepeareResponse = (em, value) => {

    if(em.type.includes('uint'))
      return keys.ipc[0].toDecimal(value);

    else if(em.type.includes('bytes'))
      return utils.fromHex(value);

    else if(em.type == 'string')
      return utils.fromHex(value);

    else if(em.type == 'bool')
      return value;

    else if(em.type == 'address')
      return value;
}

module.exports = {
  TX
}
