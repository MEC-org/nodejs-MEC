pragma solidity^0.4.18;

contract Getter {

    address[] allUsers;
    bytes32[] allNets;

    struct ChainUsers {
        mapping (address => bool) validChainUser;
        mapping (address => ValidChainUserNodes) validChainUserNodes;
    }
    ChainUsers chu;

    struct ValidChainUserNodes {
        bytes32[] allUserNodes;
        mapping (bytes32 => bytes) nodeNameToEnode;
    }


    function startIamChain () public {
        require(!chu.validChainUser[msg.sender]);
        chu.validChainUser[msg.sender] = true;
        allUsers.push(msg.sender);
    }

    function setUserNode (bytes32 node_name, bytes enode_url) public {
        require(chu.validChainUser[msg.sender]);
        chu.validChainUserNodes[msg.sender].allUserNodes.push(node_name);
        chu.validChainUserNodes[msg.sender].nodeNameToEnode[node_name] = enode_url;
        allNets.push(node_name);
    }

    function getUserNodes (address user_address) public view returns (bytes32[]) {
        require(chu.validChainUser[msg.sender]);
        return chu.validChainUserNodes[user_address].allUserNodes;
    }

    function getUserEnodeUrl (bytes32 node_name, address user_address) public view returns (bytes) {
        require(chu.validChainUser[msg.sender]);
        return chu.validChainUserNodes[user_address].nodeNameToEnode[node_name];
    }

    function getAllUsers() public view returns (address[]) {
        return allUsers;
    }

    function getAllNets() public view returns (bytes32[]) {
        return allNets;
    }

} 
