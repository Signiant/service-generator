var uuid = require('node-uuid');
var yoEnv = require('./yo-env.js');
var path = require('path');
var cleanup = require('./cleanup');
var git = require('./tasks/git');
var jenkins= require('./tasks/jenkins');
var phabricator = require('./tasks/phabricator');

module.exports = function (io, rootDir){
    var service = {};

    io.on('connection', function(socket) {

        socket.on('error', function(err){
            console.log('Socket Error : ' + err);
        });

        socket.uuid = uuid.v4();
        console.log('New connection - ' + socket.uuid);

        var yoWeb = new yoEnv(socket, rootDir);
        yoWeb.registerGeneratorsIn(path.join(rootDir, 'generators'), function(){
            var services = yoWeb.getGeneratorNames();
            socket.emit('service:list', services);
        });

        socket.on('disconnect', disconnect);

        function disconnect() {
            console.log('Disconnected - ' + socket.uuid);
            cleanup(path.join(rootDir, 'dist', socket.uuid));
         }

        socket.on('service:answer', serviceAnswer);

        function serviceAnswer(answers) {
            answers = JSON.parse(answers);
            service.name = answers.projectName;
            service.type = answers.service;
            yoWeb.generateService(answers.service, answers.projectName, function(){
                console.log('Generator complete');
                socket.emit('yo:success');
            });
        }


        socket.on('git:answer', repoTask);

        function repoTask(data){
            data = JSON.parse(data);

            phabricator(data.name, data.callsign, function(err, response){
                if(err){
                    console.log(err);
                    socket.emit('git:error', err);
                }else{
                    service.repo = response.web;
                    setTimeout(gitTask.bind(null, response.git), 1000);
                }
            })
        }

        function gitTask(repo){
            git(path.join(rootDir, 'dist', socket.uuid), repo, function(err, response) {
                if (err) {
                    console.log(err);
                    socket.emit('git:error', err);
                } else {
                    socket.emit('git:success');
                    jenkins.fixName(service.name, service.type, jenkinsTask);
                }
            });
        }

        socket.on('jenkins:answer', jenkinsTask);

        function jenkinsTask(jobName){
            jenkins.run(service.type, jobName, service.repo, function(err, data){
                if(err){
                    console.log(err);
                    socket.emit('jenkins:error', err);
                }else{
                    service.job = 'http://' + data;
                    tasksComplete();
                }
            });
        }

        socket.on('jenkins:skip', jenkinsSkip);

        function jenkinsSkip(){
            service.job = null;
            tasksComplete();
        }

        function tasksComplete(){
            console.log("Tasks complete");
            console.log("Generated service : ", service);
            socket.emit('done', service);

        }
    });
};
