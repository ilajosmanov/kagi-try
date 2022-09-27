export class EventEmitter {
  events = {}

  emit(event, ...args) {
    const callbacks = this.events[event] || []
    for (let i = 0, length = callbacks.length; i < length; i++) {
      const callback = callbacks[i]
      callback(...args)
    }
  }

  on(event, callback) {
    if (this.events[event]) {
      this.events[event].push(callback)
    } else {
      this.events[event] = [callback]
    }

    return () => {
      this.events[event] = this.events[event]?.filter(i => callback !== i)
    }
  }
}
