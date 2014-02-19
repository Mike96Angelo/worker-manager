module.exports = function FileWorker() {
    var tasks = {},
        on = function (name, callback) {
            tasks[name] = callback;
        };
    process.on('message', function (message) {
        var mess = JSON.parse(message),
            taskArgs = Array.prototype.slice.call(mess.data);

        mess['time-started'] = Date.now();
        try {
            mess.data = tasks[mess.name](taskArgs);
        } catch (err) {
            mess.data = undefined;
            mess.error = err;
        }
        mess['time-finished'] = Date.now();
        mess['task-time'] = mess['time-finished']
                                - mess['time-started'];
        process.send(JSON.stringify(mess));
    });

    Object.defineProperty(this, 'on', {value: on});
};