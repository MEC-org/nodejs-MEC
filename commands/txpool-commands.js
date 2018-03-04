const exec = require('child_process').exec;

var Txpool = function(node) {
	Txpool.content = new Promise((r,e)=>{
		content(node).then((res)=>{
			let x = JSON.parse(res).result.pending;
			let y = forEach(x);
			r(y)
		})
		.catch((error)=>{
			e(error);
		})
	});
}

function forEach(data, callback) {
  for(let key in data) {
    var arr = [];
    arr.push(data[key]);
  }
  return arr;
}

function content(node) {
	return new Promise((r,e)=>{
		execute(`echo '{"jsonrpc":"2.0","method":"txpool_content","params":[],"id":1092015}' | nc -U .chainData/signup/./MEC.ipc`).then((result)=>{
			r(result);
		})
		.catch((error)=>{
			e(error);
		})
	});
}


function execute(command){
  return new Promise((resolve,reject)=>{
    exec(command, function(error, stdout, stderr){ 
      if(error) reject(error); 
      else if(stdout) resolve(stdout);
      else if(stderr) resolve(stderr);
    });
  });
}

module.exports = Txpool;
