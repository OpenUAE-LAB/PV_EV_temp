#! /bin/bash

CHANNEL_NAME=${1:-"workspace"}
CC_NAME=${2}
CC_VERSION=${3:-"1.0"}
CC_SEQUENCE=${4:-"1"}

PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
echo "PackAGE_ID : "
echo $PACKAGE_ID
########### commit chaincode
peer lifecycle chaincode approveformyorg -o orderer1.workspace:7050 --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --package-id ${PACKAGE_ID} --sequence ${CC_SEQUENCE} --signature-policy "OR('Org1MSP.member', 'Org2MSP.member')"
#peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer1.workspace --tls --cafile "$ORDERER_CA" --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --package-id ${PACKAGE_ID} --sequence ${CC_SEQUENCE} ${INIT_REQUIRED} ${CC_END_POLICY} ${CC_COLL_CONFIG} >&log.txt

peer lifecycle chaincode checkcommitreadiness -o orderer1.workspace:7050 --channelID $CHANNEL_NAME --tls --cafile $ORDERER_CA --name ${CC_NAME} --version ${CC_VERSION}  --sequence ${CC_SEQUENCE} --signature-policy "OR('Org1MSP.member', 'Org2MSP.member')"