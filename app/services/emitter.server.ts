import { EventEmitter } from "node:events";
declare global {
  var emitter: EventEmitter;
}

if (!global.emitter) {
  global.emitter = new EventEmitter();
}

export const emitter = global.emitter;

export const Events = {
  eventChanged() {
    global.emitter.emit("/");
  },
};
