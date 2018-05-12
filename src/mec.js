const layers = require('./function/startChain.js'),
	  layer  = require('./function/createMyChain.js'),
	newLayer = layer.createMyChain,
		 mng = require('./appStructure/keyElements.js').keyElements,
		  tx = require('./utils/tx.js').TX,
       utils = require('./utils/utils.js'),
	accounts = require('./utils/accManag.js').Accounts,
	     app = require('./function/appConfigs.js').APP,
		node = require('./function/appConfigs.js').CLI;


module.exports={
	layers,
	newLayer,
	node,
	app,
	mng,
	accounts,
	utils,
	tx
}
