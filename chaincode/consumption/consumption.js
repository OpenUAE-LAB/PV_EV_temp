'use strict';
// SDK Library to asset with writing the logic
const { Contract } = require('fabric-contract-api');

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

class ConsumptionContract extends Contract {

  constructor() {
    super('ConsumptionContract');
    this.TxID = ''
  }

  /**
   * is done befor the transaction starts
   * @param {*} ctx 
   */
  async beforeTransaction(ctx) {
    // default implementation is do nothing
    this.TxID = ctx.stub.getTxID();
    console.log(`we can do some logging for ${this.TxID} !!`)
  }

  /**
   * is done after the transaction ends
   * @param {*} ctx 
   * @param {*} result 
   */
  async afterTransaction(ctx, result) {
    // default implementation is do nothing
    console.log(`TX ${this.TxID} done !!`)
  }

  // AssetExists returns true when asset with given ID exists in world state
  async AssetExists(ctx, assetName) {
    // ==== Check if asset already exists ====
    let assetState = await ctx.stub.getState(assetName);
    return assetState && assetState.length > 0;
  }

  /**
   * store a new state
   */
  async store(ctx, assetID, station, consumer, vehicle,  amount, startDateTime, endDateTime,initalChargingPercentage, endChargingPercentage , hash) {
    console.info(`${BLUE}============= START : store ===========${RESET}`);
    if (!assetID) {
      throw new Error('Asset name must not be empty');
    }

    // compose our model
    let model = {
      assetID: assetID,
      station: station,
      vehicle: vehicle,
      amount: amount,
      consumer: consumer,
      startDateTime: new Date(startDateTime),
      initalChargingPercentage: initalChargingPercentage, 
      endChargingPercentage:endChargingPercentage, 
      endDateTime: 0,
      hash: hash,
    }

    // store the new state
    const assetBuffer = Buffer.from(JSON.stringify(model));
    
    await ctx.stub.putState(assetID, assetBuffer);
    ctx.stub.setEvent('store', assetBuffer);
    console.info(`${BLUE}============= END : store ===========${RESET}`);

  }

  /**
   * get the asset stored in the world state with given id
   */
  async get(ctx, assetID) {

    console.info(`${BLUE}============= START : get ===========${RESET}`);

    // get the asset from chaincode state
    const assetJSON = await ctx.stub.getState(assetID);
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`Asset ${assetID} does not exist`);
    }

    console.info(`${BLUE}============= END : get ===========${RESET}`);
    return assetJSON.toString();

  }

  async end(ctx, assetID, station, consumer, vehicle,  amount, startDateTime, endDateTime,initalChargingPercentage, endChargingPercentage , hash) {

    console.info(`${BLUE}============= START : end===========${RESET}`);

    let assetAsBytes = await ctx.stub.getState(assetID);
    if (!assetAsBytes || !assetAsBytes.toString()) {
      throw new Error(`Asset ${assetID} does not exist`);
    }

    // compose our model
    let model = {
      assetID: assetID,
      station: station,
      vehicle: vehicle,
      amount: amount,
      consumer: consumer,
      startDateTime:startDateTime,
      initalChargingPercentage: initalChargingPercentage, 
      endChargingPercentage:endChargingPercentage, 
      endDateTime: endDateTime,
      hash: hash,
    }

    // store the new state with the primary key (assetID)
    const assetBuffer = Buffer.from(JSON.stringify(model));
    ctx.stub.setEvent('end', assetBuffer);
    await ctx.stub.putState(assetID, assetBuffer);

    console.info(`${BLUE}============= END : end ===========${RESET}`);
  }

  /**
   * change the asset stored in the world state with given id
   */
  async change(ctx,assetID, station, consumer, vehicle,  amount, startDateTime, endDateTime,initalChargingPercentage, endChargingPercentage , hash) {

    console.info(`${BLUE}============= START : change ===========${RESET}`);

    let assetAsBytes = await ctx.stub.getState(assetID);
    if (!assetAsBytes || !assetAsBytes.toString()) {
      throw new Error(`Asset ${assetID} does not exist`);
    }

    // compose our model
    let model = {
      assetID: assetID,
      station: station,
      vehicle: vehicle,
      amount: amount,
      consumer: consumer,
      startDateTime:startDateTime,
      initalChargingPercentage: initalChargingPercentage, 
      endChargingPercentage:endChargingPercentage, 
      endDateTime: endDateTime,
      hash: hash,
    }

    // store the new state with the primary key (assetID)
    const assetBuffer = Buffer.from(JSON.stringify(model));
    ctx.stub.setEvent('change', assetBuffer);
    await ctx.stub.putState(assetID, assetBuffer);

    console.info(`${BLUE}============= END : change ===========${RESET}`);
  }

  /**
   * delete an asset key/value pair from state
   */
  async remove(ctx, assetID) {

    console.info(`${BLUE}============= START : remove ===========${RESET}`);

    if (!assetID) {
      throw new Error('Asset name must not be empty');
    }

    let exists = await this.AssetExists(ctx, assetID);
    if (!exists) {
      throw new Error(`Asset ${assetID} does not exist`);
    }
    let model = {
      assetID: assetID,
    }
    const assetBuffer = Buffer.from(JSON.stringify(model));
    ctx.stub.setEvent('remove', assetBuffer);
    await ctx.stub.deleteState(assetID); //remove the asset from chaincode state

    console.info(`${BLUE}============= END : remove ===========${RESET}`);

  }

  /**
  * get history of the asset stored in the world state with given id
  */
  async history(ctx, assetID) {

    console.info(`${BLUE}============= START : history ===========${RESET}`);

    console.info('getting history for key: ' + assetID);

    let result = [];

    let iterator = await ctx.stub.getHistoryForKey(assetID);
    let res = await iterator.next();
    while (!res.done) {
      if (res.value) {
        console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
        let obj;
        try {
          obj = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
        }
        result.push(obj);
      }
      res = await iterator.next();
    }
    await iterator.close();

    console.info(`${BLUE}============= END : history ===========${RESET}`);

    return result;

  }
};

module.exports = ConsumptionContract