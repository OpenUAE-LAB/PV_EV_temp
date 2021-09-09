/**
 * helper functions
 */

const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')
const connectionProfilePath = require("../AApi/resolvers/networkConfig.js").connectionProfilePath;
const cppFileExtension = require("../AApi/resolvers/networkConfig.js").cppFileExtension;
const logging = require("./resolvers/logging.js"); 
/**
 * loads the existing CCP
 */
exports.buildCCP = function () {
  // load the common connection configuration file
  let ccpPath ="";
  console.log("buildCCP -  Path: ",connectionProfilePath);
  logging.addLog("buildCCP.js", "--", 18, `"buildCCP - Path:${connectionProfilePath}`);
    
  
  const fileExists = fs.existsSync(connectionProfilePath);
  if (!fileExists) {
    throw new Error(`no such file or directory: ${ccpPath}`);
  }

  let ccp = ""
  const contents = fs.readFileSync(connectionProfilePath, 'utf8');
  if(cppFileExtension=="json"){
    // build a JSON object from the file contents
    ccp = JSON.parse(contents);
  }else if(cppFileExtension=="yaml"){
    ccp = yaml.load(contents);
    
  }


  return ccp;
};

/**
 * Create a new  wallet : Note that wallet is for managing identities.
 * @param {*} Wallets 
 * @param {*} walletPath 
 */
exports.buildWallet = async function (Wallets, walletPath) {
  let wallet;
  if (walletPath) {
    wallet = await Wallets.newFileSystemWallet(walletPath);
    //console.log(`Built a file system wallet at ${walletPath}`);
  } else {
    wallet = await Wallets.newInMemoryWallet();
    //console.log('Built an in memory wallet');
  }

  return wallet;
};

/**
 * create a json string
 * @param {*} inputString 
 */
exports.prettyJSONString = function (inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}
