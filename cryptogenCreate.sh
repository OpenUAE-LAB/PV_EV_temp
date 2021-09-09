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
echo $FABRIC_CFG_PATH

if [ ! -d ./channel-artifacts ]; then
            mkdir channel-artifacts
    fi

    if [ ! -f $GOPATH/bin/configtxgen ]; then
    configtxgen -profile Raft -channelID mychannel -outputBlock ./channel-artifacts/genesis.block
fi


