#!/bin/bash
set -u
set -e

NETID=91350

FLAGS="--datadir CommunicationNode --networkid $NETID --nodiscover --shh --port $2"

RPC_API="admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft"
HTTP_RPC_ARGS="--rpc --rpcaddr 0.0.0.0 --rpcport $1 --rpcapi $RPC_API"
WS_RPC_ARGS="--ws --wsaddr 0.0.0.0 --wsport $3 --wsapi $RPC_API --wsorigins=*"

ALL_ARGS="$FLAGS $HTTP_RPC_ARGS $WS_RPC_ARGS"

nohup ./Quorum/./geth $ALL_ARGS &> communicationNode.log &

echo "[*] Communication node started"
