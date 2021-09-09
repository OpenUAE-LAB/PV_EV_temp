# docker stop $(docker ps -a -q)
# docker rm -f $(docker ps -aq)
# docker rmi -f $(docker images -q)
# docker system prune -a 
# docker system prune -a
# docker network prune


#temp change
docker stop $(docker ps -a -q)


export COMPOSE_PROJECT_NAME=net
export IMAGE_TAG=latest
export SYS_CHANNEL=workspace-sys-channel

docker-compose -f docker-compose.yaml -f docker-compose-couch.yaml up -d





docker stop $(docker ps -a -q)  ; docker rm -f $(docker ps -aq) ; 
docker system prune -a ; docker volume prune ; docker volume ls; docker network prune


sudo rm -rf ./crypto-config
sudo rm -rf ./channel-artifacts
sudo rm -rf ./storage
sudo rm -rf ./application/identity
rm  application/connection-org1.json
rm  application/connection-org2.json

mkdir channel-artifacts
mkdir storage



# install and test our chaincodes
cd chaincode
cd consumption
rm -rf node_modules/
npm install --save fabric-contract-api fabric-shim
cd ..

# install and test our chaincodes
cd production
rm -rf node_modules/
npm install --save fabric-contract-api fabric-shim
cd ..

# install and test our chaincodes
cd invoice
rm -rf node_modules/
npm install --save fabric-contract-api fabric-shim

cd ..
cd ..




export FABRIC_CFG_PATH=$PWD
export CHANNEL_NAME=workspace

cryptogen generate --config=./crypto-config.yaml
configtxgen -profile Raft -channelID workspace-sys-channel -outputBlock ./channel-artifacts/genesis.block


configtxgen -profile TwoOrgsChannel -outputCreateChannelTx  ./channel-artifacts/workspace.tx -channelID $CHANNEL_NAME
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org2MSP



export COMPOSE_PROJECT_NAME=net
export IMAGE_TAG=latest
export SYS_CHANNEL=workspace-sys-channel

docker-compose -f docker-compose.yaml -f docker-compose-couch.yaml up -d

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



## We are also going to update the current peer(PEER 1) as an anchor peer. 
## add org 1
## the variables have been already set - don't need to set it again

peer channel join -b ./workspace.block


CORE_PEER_ADDRESS=peer2.org1.workspace:8051
peer channel join -b ./workspace.block

CORE_PEER_ADDRESS=peer1.org1.workspace:7051
peer channel update \
	-o orderer1.workspace:7050 \
	-c $CHANNEL_NAME \
	-f ./channel-artifacts/Org1MSPanchors.tx \
	--tls \
	--cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/workspace/orderers/orderer1.workspace/msp/tlscacerts/tlsca.workspace-cert.pem



# add org 2 0 set variables - then join hte channel - then update teh channel
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/users/Admin@org2.workspace/msp
CORE_PEER_ADDRESS=peer1.org2.workspace:9051
CORE_PEER_LOCALMSPID="Org2MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/peers/peer1.org2.workspace/tls/ca.crt
peer channel join -b ./workspace.block


CORE_PEER_ADDRESS=peer2.org2.workspace:10051
peer channel join -b ./workspace.block

peer channel update \
	-o orderer1.workspace:7050 \
	-c $CHANNEL_NAME \
	-f ./channel-artifacts/Org2MSPanchors.tx \
	--tls \
	--cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/workspace/orderers/orderer1.workspace/msp/tlscacerts/tlsca.workspace-cert.pem

exit


#docker exec -it cli sh
#cd scripts  
#bash installCommitCC.sh workspace production





docker exec -it cli sh

cd scripts

## set variables to org 1
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.workspace/users/Admin@org1.workspace/msp
CORE_PEER_ADDRESS=peer1.org1.workspace:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.workspace/peers/peer1.org1.workspace/tls/ca.crt
      
bash install_chainCode_org1.sh workspace consumption
bash install_chainCode_org1.sh workspace invoice
bash install_chainCode_org1.sh workspace production

bash commit_chainCode_org1.sh workspace consumption
bash commit_chainCode_org1.sh workspace invoice
bash commit_chainCode_org1.sh workspace production
exit


docker exec -it cli sh
cd scripts   

# add org 2 0 set variables - then join hte channel - then update teh channel
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/users/Admin@org2.workspace/msp
CORE_PEER_ADDRESS=peer1.org2.workspace:9051
CORE_PEER_LOCALMSPID="Org2MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/peers/peer1.org2.workspace/tls/ca.crt

   
bash install_chainCode_org2.sh workspace consumption
bash install_chainCode_org2.sh workspace invoice
bash install_chainCode_org2.sh workspace production

bash commit_chainCode_org2.sh workspace consumption
bash commit_chainCode_org2.sh workspace invoice
bash commit_chainCode_org2.sh workspace production
exit


cd scripts
bash ccp-generate.sh


cd ..

### adding the wallet
cd application
node addToWallet.js

cd ../AApi
node pv_api.js