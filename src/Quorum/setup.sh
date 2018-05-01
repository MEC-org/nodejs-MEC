#!/bin/bash

sudo apt-get update
sudo apt-get install -y build-essential libssl-dev git curl

sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install -y ethereum
sudo mv /usr/bin/geth /usr/bin/normalGeth

echo "PATH=\$PATH:"$PWD/build/bin >> ~/.bashrc
source ~/.bashrc
export PATH=$PWD/build/bin:$PATH

mkdir -p constellation && cd constellation/
sudo apt-get install -y unzip libdb-dev libleveldb-dev libsodium-dev zlib1g-dev libtinfo-dev
wget https://github.com/jpmorganchase/constellation/releases/download/v0.1.0/constellation-0.1.0-ubuntu1604.tar.xz -O constellation-0.1.0-ubuntu1604.tar.xz
tar -xf constellation-0.1.0-ubuntu1604.tar.xz
chmod +x constellation-0.1.0-ubuntu1604/constellation-node
echo "PATH=\$PATH:"$PWD/constellation-0.1.0-ubuntu1604 >> ~/.bashrc
source ~/.bashrc
export PATH=$PWD/constellation-0.1.0-ubuntu1604:$PATH

cd ..
npm install
