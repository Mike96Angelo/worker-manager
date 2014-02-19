var EventEmitter = require ('events').EventEmitter;

module.exports = {
    Worker: function Worker( file ) {
        var eventEmitter = new EventEmitter(),
        var emit = function ( /* event, [...args] */ ) {
            return eventEmitter.emit(Array.prototype.slice.call(arguments));
        },
        on = function ( event, callback ) {
            return eventEmitter.on(event, callback);
        };
        Object.defineProperty(this, 'emit', {value: emit});
        Object.defineProperty(this, 'on', {value: on});
    },
    Manager: function Manager( file ) {

    }
};