import { enqueueSync } from './sync.js';
import { state } from './state.js';

/**
 * UI LEGACY BRIDGE
 * maps old functions -> V3 engine
 */

window.addRecord = function(data){
  enqueueSync("UPSERT_RECORD", data);
};

window.deleteRecord = function(id){
  enqueueSync("DELETE_RECORD", {id});
};

window.addAppointment = function(data){
  enqueueSync("UPSERT_APPOINTMENT", data);
};

window.syncNow = function(){
  return enqueueSync("FORCE_SYNC", {});
};

window.getState = function(){
  return state;
};
