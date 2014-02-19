module.exports = (function () {
    var WorkerManager = {},
        Job = require('./lib/Job.js'),
        FileWorker = require('./lib/Worker.js'),
        WorkerFile = require('./lib/WorkerFile.js'),
        Manager = require('./lib/Manager.js');
        
    Object.defineProperty(WorkerManager, 'createManager', {
        value : function (filename, max, keepAlive) {
            return new Manager(filename, max, keepAlive, FileWorker, Job); 
        }
    });
    Object.defineProperty(WorkerManager, 'createWorker', {
        value : function () { return new WorkerFile(); }
    });

    return WorkerManager;
}());