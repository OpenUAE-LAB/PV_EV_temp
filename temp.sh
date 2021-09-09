docker stop $(docker ps -a -q)
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -q)
docker system prune -a 
docker system prune -a
docker network prune



if [ ! -f $GOPATH/bin/cryptogen ]; then
    go get github.com/hyperledger/fabric/common/tools/cryptogen
fi

echo
    echo "##########################################################"
    echo "##### Generate certificates using cryptogen tool #########"
    echo "##########################################################"
    if [ -d ./crypto-config ]; then
            rm -rf ./crypto-config
    fi

cryptogen generate --config=./crypto-config.yaml
echo

export FABRIC_CFG_PATH=$PWD

export CHANNEL_NAME=workspace


if [ ! -d ./channel-artifacts ]; then
            mkdir channel-artifacts
    fi

    if [ ! -f $GOPATH/bin/configtxgen ]; then
    configtxgen -profile Raft -channelID workspace-sys-channel -outputBlock ./channel-artifacts/genesis.block
    
fi



configtxgen -profile TWoOrgsChannel -outputCreateChannelTx  ./channel-artifacts/workspace.tx -channelID $CHANNEL_NAME

configtxgen -profile TWoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
configtxgen -profile TWoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org2MSP



export COMPOSE_PROJECT_NAME=net
export IMAGE_TAG=latest
export SYS_CHANNEL=workspace-sys-channel


docker-compose -f docker-compose.yaml up -d



docker exec -it cli bash
export CHANNEL_NAME=workspace
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.workspace/users/Admin@org1.workspace/msp
CORE_PEER_ADDRESS=peer1.org1.workspace:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.workspace/peers/peer1.org1.workspace/tls/ca.crt


peer channel create \
    -o orderer1.workspace:7050 \
    -c $CHANNEL_NAME \
    -f ./channel-artifacts/$CHANNEL_NAME.tx \
    --outputBlock ./$CHANNEL_NAME.block \
    --tls \
    --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/workspace/orderers/orderer1.workspace/msp/tlscacerts/tlsca.workspace-cert.pem



## start writing the chaincodes

docker run -t -i -v /root:/opt/root debian /bin/bash

docker exec -it cli sh
cd scripts      
bash install_chainCode_org1.sh workspace consumption
bash install_chainCode_org1.sh workspace invoice
bash install_chainCode_org1.sh workspace production

bash commit_chainCode_org1.sh workspace consumption
bash commit_chainCode_org1.sh workspace invoice
bash commit_chainCode_org1.sh workspace production
exit


docker exec -it cli sh
cd scripts      
./install_chainCode_org1.sh workspace consumption
exit
