module.exports = function FileWorker(filename, keepAlive) {
    'use strict';
    var cp = require('child_process'),
        fileWorker = this,
        workerId,
        onready,
        onerror,
        idleTime,
        killWoker,
        worker,
        task,
        idleFor = function (time) {
            return task ? 0 : Date.now() - idleTime > time;
        },
        close = function () {
            if (worker) {
                worker.kill();
                worker = undefined;
                task = undefined;
            }
        },
        start = function () {
            worker = cp.fork(filename);
            worker.on('message', function (message) {
                idleTime = Date.now();
                var mess = JSON.parse(message);
                mess['time-completed'] = Date.now();
                mess['total-time'] = mess['time-completed']
                                        - mess['time-created'];
                task.callback(mess.error, mess.data, mess);
                task = undefined;
                return onready ? onready(fileWorker, mess) : undefined;
            });
            worker.on('error', function (error) {
                idleTime = Date.now();
                return onerror ? onerror(fileWorker, error) : undefined;
            });
            idleTime = Date.now();
            if (!keepAlive) {
                killWoker = setInterval(function () {
                    if (idleFor(5000)) {
                        close();
                        clearInterval(killWoker);
                    }
                }, 1000);
            }

            return onready ? onready(fileWorker, undefined) : undefined;
        },
        send = function (job) {
            if (!worker) {
                start();
            }
            if (!task && job) {
                task = job;
                worker.send(JSON.stringify(task));
                return true;
            }
            return false;
        };

    Object.defineProperty(this, 'send', {value: send});
    Object.defineProperty(this, 'close', {value: close});
    Object.defineProperty(this, 'start', {value: start});
    Object.defineProperty(this, 'restart', {
        value: function () {
            close();
            start();
        }
    });
    Object.defineProperty(this, 'id', {
        get : function () { return workerId; },
        set : function (m) { workerId = m; }
    });
    Object.defineProperty(this, 'status', {
        get : function () { return task ? 'working' : 'ready'; }
    });
    Object.defineProperty(this, 'task', {
        get : function () { return task; }
    });
    Object.defineProperty(this, 'onready', {
        get : function () { return onready; },
        set : function (m) { onready = typeof m === 'function' ? m : undefined; }
    });
    Object.defineProperty(this, 'onerror', {
        get : function () { return onerror; },
        set : function (m) { onerror = typeof m === 'function' ? m : undefined; }
    });
};