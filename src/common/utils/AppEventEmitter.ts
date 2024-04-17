import EventEmitter from 'eventemitter3';

let emitter: EventEmitter = new EventEmitter();
export const getEventEmitter = () => {
  if (emitter === null) {
    emitter = new EventEmitter();
  }
  return emitter;
};
