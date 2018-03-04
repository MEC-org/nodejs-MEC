const startLayer = require('./function/startChain.js');
const newLayer = require('./function/createMyChain.js');
const mng = require('./appStructure/keyElements.js');
const tx = require('./utils/tx.js');
const eth = require('./commands/eth-commands.js');
const init = startLayer.init;
const utils = require('./utils/utils.js')

module.exports={
	startLayer,
	newLayer,
	mng,
	utils,
	tx,
	eth,
	init
}