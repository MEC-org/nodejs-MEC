const layers = require('./function/startChain.js');
const layer = require('./function/createMyChain.js');
const newLayer = layer.createMyChain;
const mng = require('./appStructure/keyElements.js');
const tx = require('./utils/tx.js').TX
// const cli = require('./commands/eth-commands.js');
const utils = require('./utils/utils.js')
const accounts = require('./utils/accManag.js')

const app = require('./function/appConfigs.js').APP;
const node = require('./function/appConfigs.js').CLI;


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