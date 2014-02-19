module.exports = function Job(id, name, data, callback) {
    'use strict';
    Object.defineProperty(this, 'id', {
        value: id,
        enumerable: true
    });
    Object.defineProperty(this, 'name', {
        value: name,
        enumerable: true
    });
    Object.defineProperty(this, 'data', {
        value: data,
        enumerable: true
    });
    Object.defineProperty(this, 'callback', {
        value: callback,
        enumerable: true
    });
    Object.defineProperty(this, 'time-created', {
        value: Date.now(),
        enumerable: true
    });
};