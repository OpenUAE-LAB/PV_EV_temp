#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${P1PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.json 
}

ORG=1
P0PORT=7051
P1PORT=8051
CAPORT=7054
PEERPEM=../crypto-config/peerOrganizations/org1.workspace/tlsca/tlsca.org1.workspace-cert.pem
CAPEM=../crypto-config/peerOrganizations/org1.workspace/ca/ca.org1.workspace-cert.pem

echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > ../application/connection-org1.json

ORG=2
P0PORT=9051
P1PORT=10051
CAPORT=9054
PEERPEM=../crypto-config/peerOrganizations/org2.workspace/tlsca/tlsca.org2.workspace-cert.pem
CAPEM=../crypto-config/peerOrganizations/org2.workspace/ca/ca.org2.workspace-cert.pem

echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > ../application/connection-org2.json