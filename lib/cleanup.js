var scheduler = require('node-schedule');
var rimraf = require('rimraf');

module.exports = function cleanup(dirPath, sched) {
    rimraf(dirPath, function(err) {
        if (err) {
            console.log("Failed to remove directory " + dirPath);
            if(typeof sched === 'undefined' || sched == true){
                var retryDate = new Date();
                retryDate.setMinutes(retryDate.getMinutes() + 1);
                scheduler.scheduleJob(retryDate, cleanup).bind(null, dirPath);
            }
        } else {
            console.log("Removed directory " + dirPath);
        }
    });
};
