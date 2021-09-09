#! /bin/bash

CHANNEL_NAME=${1:-"workspace"}
CC_NAME=${2}
CC_VERSION=${3:-"1.0"}
CC_SEQUENCE=${4:-"1"}
CC_SRC_PATH=/opt/gopath/src/github.com/chaincode/$CC_NAME




# package chaincode
peer lifecycle chaincode package ../${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang node --label ${CC_NAME}_${CC_VERSION}
# install chaincode on peer
peer lifecycle chaincode install ../${CC_NAME}.tar.gz

# query installed
peer lifecycle chaincode queryinstalled >&log.txt

cat log.txt

PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)

# peer 1 of org 2
export CORE_PEER_ADDRESS=peer1.org2.workspace:9051
export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/peers/peer1.org2.workspace/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/peers/peer1.org2.workspace/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/peers/peer1.org2.workspace/tls/ca.crt


peer lifecycle chaincode queryinstalled

