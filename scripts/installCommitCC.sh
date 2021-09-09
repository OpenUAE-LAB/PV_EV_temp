CHANNEL_NAME=${1:-"workspace"}
CC_NAME=${2}
CC_VERSION=${3:-"1.0"}
CC_SEQUENCE=${4:-"1"}
CC_SRC_PATH=/opt/gopath/src/github.com/chaincode/$CC_NAME



## package the chaincode
## packageChaincod

## set variables to org 1
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.workspace/users/Admin@org1.workspace/msp
CORE_PEER_ADDRESS=peer1.org1.workspace:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.workspace/peers/peer1.org1.workspace/tls/ca.crt

PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang node --label ${CC_NAME}_${CC_VERSION} >&log.txt

echo "==========================================================="
sleep 10
echo "==========================================================="

echo "Installing chaincode on peer1.org1..."
## installChaincode 1
## set variables to org 1
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.workspace/users/Admin@org1.workspace/msp
CORE_PEER_ADDRESS=peer1.org1.workspace:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.workspace/peers/peer1.org1.workspace/tls/ca.crt
      
# install chaincode on peer
peer lifecycle chaincode install ${CC_NAME}.tar.gz >&log.txt

echo " check the installed chaincodes"
peer lifecycle chaincode queryinstalled

cat log.txt
echo "==========================================================="
sleep 10
echo "==========================================================="


echo "Install chaincode on peer1.org2..."
# installChaincode 2

# add org 2 0 set variables 
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/users/Admin@org2.workspace/msp
CORE_PEER_ADDRESS=peer1.org2.workspace:9051
CORE_PEER_LOCALMSPID="Org2MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/peers/peer1.org2.workspace/tls/ca.crt
# install chaincode on peer
peer lifecycle chaincode install ${CC_NAME}.tar.gz >&log.txt

echo "check the installed chaincodes"
peer lifecycle chaincode queryinstalled
   

cat log.txt

echo "==========================================================="
sleep 10
echo "==========================================================="
echo "approve the definition for org1"
# approveForMyOrg 1
## set variables to org 1
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.workspace/users/Admin@org1.workspace/msp
CORE_PEER_ADDRESS=peer1.org1.workspace:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.workspace/peers/peer1.org1.workspace/tls/ca.crt
      
peer lifecycle chaincode approveformyorg -o localhost:7050 \
--ordererTLSHostnameOverride orderer1.workspace --tls --cafile "$ORDERER_CA" \
--channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION}\
 --package-id ${PACKAGE_ID} --sequence ${CC_SEQUENCE} --signature-policy "OR('Org1MSP.member', 'Org2MSP.member')">&log.txt

cat log.txt

echo "==========================================================="
sleep 10
echo "==========================================================="

echo "ORG1 = check whether the chaincode definition is ready to be committed "
peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME \
--name ${CC_NAME} --version ${CC_VERSION} --sequence ${CC_SEQUENCE} --signature-policy "OR('Org1MSP.member', 'Org2MSP.member')" --output json >&log.txt

cat log.txt
echo "==========================================================="
sleep 10
echo "==========================================================="
echo "ORG2 = approve the definition for org2"
# add org 2 0 set variables
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/users/Admin@org2.workspace/msp
CORE_PEER_ADDRESS=peer1.org2.workspace:9051
CORE_PEER_LOCALMSPID="Org2MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/peers/peer1.org2.workspace/tls/ca.crt

peer lifecycle chaincode approveformyorg -o localhost:7050 \
--ordererTLSHostnameOverride orderer1.workspace --tls --cafile "$ORDERER_CA" \
--channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION}\
 --package-id ${PACKAGE_ID} --sequence ${CC_SEQUENCE} --signature-policy "OR('Org1MSP.member', 'Org2MSP.member')">&log.txt


cat log.txt
echo "==========================================================="
sleep 10
echo "==========================================================="

echo "ORG2 = check whether the chaincode definition is ready to be committed "
peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME \
--name ${CC_NAME} --version ${CC_VERSION} --sequence ${CC_SEQUENCE} --signature-policy "OR('Org1MSP.member', 'Org2MSP.member')" --output json >&log.txt

cat log.txt
echo "==========================================================="
sleep 10
echo "==========================================================="
echo "ORG2 = COMMIT All cHANGES  "


export CRT_FILE_1=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.workspace/peers/peer1.org1.workspace/tls/ca.crt 
export CRT_FILE_2=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/peers/peer1.org2.workspace/tls/ca.crt 

peer lifecycle chaincode commit -o localhost:7050 \
--ordererTLSHostnameOverride orderer1.workspace --tls --cafile "$ORDERER_CA"\
 --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} \
     --peerAddresses peer1.org1.workspace:7051 --tlsRootCertFiles ${CRT_FILE_1} \
    --peerAddresses peer1.org2.workspace:9051 --tlsRootCertFiles ${CRT_FILE_2} \
 --sequence ${CC_SEQUENCE} --signature-policy "OR('Org1MSP.member', 'Org2MSP.member')" >&log.txt

cat log.txt


echo "==========================================================="
sleep 10
echo "==========================================================="
echo "query on both orgs to see that the definition committed successfully"

## set variables to org 1
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.workspace/users/Admin@org1.workspace/msp
CORE_PEER_ADDRESS=peer1.org1.workspace:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.workspace/peers/peer1.org1.workspace/tls/ca.crt
      
peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME} >&log.txt

cat log.txt
echo "==========================================================="
sleep 10
echo "==========================================================="
echo "query on both orgs to see that the definition committed successfully"

# add org 2 0 set variables
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/users/Admin@org2.workspace/msp
CORE_PEER_ADDRESS=peer1.org2.workspace:9051
CORE_PEER_LOCALMSPID="Org2MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.workspace/peers/peer1.org2.workspace/tls/ca.crt


peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME} >&log.txt
cat log.txt