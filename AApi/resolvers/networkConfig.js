//const channelName = 'mychannel';
const channelName = 'workspace';
const connectionProfilePath ="/home/openuae/Documents/PV_EV_temp/application/ccp_org1.yaml"
// "/home/openuae/Downloads/hlf/application/ccp_org1.yaml" //cpp.json 
const cppFileExtension ="yaml" //yaml
const identityLabel = "openuae" ;//admin
//const walletPath = '/home/openuae/fabric-samples/fabric-network2/application/identity/user/openuae/wallet';//'../../wallet'

const walletPath = "/home/openuae/Documents/PV_EV_temp/application/identity/user/openuae/wallet"
//'/home/openuae/Downloads/hlf/application/identity/user/openuae/wallet';//'../../wallet'
const chaincodeName_production = 'production'
const chaincodeNameInvoice = 'invoice'
const chaincodeNameConsumption = 'consumption'

module.exports = {
    channelName,
    connectionProfilePath,
    cppFileExtension,
    identityLabel,
    walletPath,
    chaincodeName_production,
    chaincodeNameInvoice,
    chaincodeNameConsumption,



}