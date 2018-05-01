const Getter = artifacts.require('../contracts/Getter.sol');

module.exports = function(deployer) {
  deployer.deploy(Getter)
}