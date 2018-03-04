const keys = require('../appStructure/keyElements.js')

let ipc;

function init_tx(net){
  // console.log(net, "6")
  ipc = net;
}


function send_BC_tx (obj, method, input, toDec, toAscii){
  return new Promise((resolve,reject)=>{
    EXEC_PROMISE_BC_METHOD(obj, method, input, toDec, toAscii)
      .then((result)=>{ resolve(result) })
      .catch((error)=>{ reject(error) });
  });
}

// add checking WTF I am trying to execute through
// OBJ ABI. It have enough data, to detect weather correct
// method or correct input is executing
let EXEC_PROMISE_BC_METHOD = (obj, method, input, toDec, toAscii)=>{
  return new Promise((r,e)=>{
    if(input != '') {
      obj[method](input, (err,res)=>{
        if(res) {
          if(toDec) r(ipc.toDecimal(res));
          else if(toAscii) r(ipc.toAscii(res));
          else r(res);
        }
        else console.log(err);
      });
    }
    obj[method]((err,res)=>{ 
      if(res) {
        if(toDec) r(ipc.toDecimal(res));
        else if(toAscii) r(ipc.toAscii(res));
        else r(res);
      }
      else console.log(err);
    });
  });
}

module.exports = {
  init_tx,
  send_BC_tx
}