#! /bin/bash

CHANNEL_NAME=${1:-"workspace"}
CC_NAME=${2}
CC_VERSION=${3:-"1.0"}
CC_SEQUENCE=${4:-"1"}

PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)

########### commit chaincode
peer lifecycle chaincode approveformyorg -o orderer1.workspace:7050 --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --package-id ${PACKAGE_ID} --sequence ${CC_SEQUENCE} --signature-policy "OR('Org1MSP.member', 'Org2MSP.member')"

peer lifecycle chaincode checkcommitreadiness -o orderer1.workspace:7050 --channelID $CHANNEL_NAME --tls --cafile $ORDERER_CA --name ${CC_NAME} --version ${CC_VERSION}  --sequence ${CC_SEQUENCE} --signature-policy "OR('Org1MSP.member', 'Org2MSP.member')"

#peer lifecycle chaincode checkcommitreadiness   --sequence ${CC_SEQUENCE} ${INIT_REQUIRED} ${CC_END_POLICY} ${CC_COLL_CONFIG} --output json >&log.txt
    


export CRT_FILE_1=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.workspace/peers/peer1.org1.workspace/tls/ca.crt 
export CRT_FILE_2=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/peers/peer1.org2.workspace/tls/ca.crt 


peer lifecycle chaincode commit -o orderer1.workspace:7050 --ordererTLSHostnameOverride orderer1.workspace --channelID $CHANNEL_NAME --name ${CC_NAME} \
    --version ${CC_VERSION} --sequence ${CC_SEQUENCE} --tls --cafile $ORDERER_CA \
    --peerAddresses peer1.org1.workspace:7051 --tlsRootCertFiles ${CRT_FILE_1} \
    --peerAddresses peer1.org2.workspace:9051 --tlsRootCertFiles ${CRT_FILE_2} \
    --signature-policy "OR('Org1MSP.member', 'Org2MSP.member')"
