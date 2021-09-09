/**
 * SUMMARY: EXPORT ALL SERVICES
 */

const addSession_toChain= require('./addSession_toChain.js');
const addSession_toDB   = require('./addSession_toDB.js');

const endSession_updateChain   = require('./endSession_updateChain.js');
const endSession_updateDB= require('./endSession_updateDB.js');

const getActiveSessionbyID   = require('./getActiveSessionbyID.js');
const getActiveSessionbyIDPopulate= require('./getActiveSessionbyIDPopulate.js');
const getAllActiveSessions   = require('./getAllActiveSessions.js');
const getAllRemovedSessions  = require('./getAllRemovedSessions.js');

const getAllSessions    = require('./getAllSessions.js');
const getAllSessionsPopulate = require('./getAllSessionsPopulate.js');

const getSession        = require('./getSession.js');
const getSession_chain  = require('./getSession_chain.js');
const getAllSessionsByDriverID  = require('./getAllSessionsByDriverID.js')
const getSessionPopulate= require('./getSessionPopulate.js');

const getSessionFinished        = require('./getSessionFinished.js');
const updateActiveSessions_db = require('./updateActiveSessions_db.js');
const updateSession_updateChain = require('./updateSession_updateChain.js');
const updateSession_updateDB    = require('./updateSession_updateDB.js');

const removeSession_updateChain = require('./removeSession_updateChain.js');
const removeSession_updateDB    = require('./removeSession_updateDB.js');
const verifySession             = require('./verifySession.js');
 
module.exports = {
    addSession_toChain,
    addSession_toDB,
    endSession_updateChain,
    endSession_updateDB,
    getAllSessions,
    getAllSessionsPopulate,
    getActiveSessionbyIDPopulate,
    getActiveSessionbyID,
    getAllActiveSessions,
    getAllRemovedSessions,
    getSession,
    getSession_chain,
    getAllSessionsByDriverID,
    getSessionPopulate,
    getSessionFinished,
    updateActiveSessions_db,
    updateSession_updateChain,
    updateSession_updateDB,
    removeSession_updateChain,
    removeSession_updateDB,
    verifySession,

}