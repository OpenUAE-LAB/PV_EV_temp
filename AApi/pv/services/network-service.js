
//Blockchain related packages.
const helper = require('../../helper.js') 
const path = require('path')

// fabric includes
const { Gateway, Wallets } = require('fabric-network');
const walletPath    = require("../../resolvers/networkConfig").walletPath;
const identityLabel = require("../../resolvers/networkConfig").identityLabel;


// Function to load network & get contract
const loadNetwork = async (channelName, chaincodeName) => {
    console.log("Loading network & connecting to chaincode...");
    // build CCP
    const ccp = await helper.buildCCP();
    // setup the wallet to hold the credentials of the application user
    let wallet = await helper.buildWallet(Wallets, walletPath);
    console.log("ccp",ccp)
    console.log("wallet",wallet)
    // Create a new gateway instance for interacting with the fabric network.
    const gateway = new Gateway();
  
    // setup the gateway instance
    // using asLocalhost as this gateway is using a fabric network deployed locally
    await gateway.connect(ccp, {
      //clientTlsIdentity
      wallet,
      identity: identityLabel,
      discovery: { enabled: false, asLocalhost: true },
    });

    // Build a network instance based on the channel where the smart contract is deployed
    const network = await gateway.getNetwork(channelName);
    console.log("channelName",channelName);
    console.log("chaincodeName",chaincodeName);
    // Get the contract from the network.
    const contract = network.getContract(chaincodeName);
    console.log("contract",contract);
    return contract;
  };

 module.exports = loadNetwork;