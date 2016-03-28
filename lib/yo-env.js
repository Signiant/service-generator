var yeoman = require('yeoman-environment');
var SocketAdapter = require('socket-adapter');
var fs = require('fs');
var path = require('path');
var generators = require('../config/generator-names.json');

function YoWeb(socket, rootDir) {
    this.socket = socket;
    console.log("Creating new yeoman environment for socket", socket.uuid);
    this.env = yeoman.createEnv([], {
        cwd: rootDir
    }, new SocketAdapter(socket));
    this.env.on('error', function(err) {
        console.error("Yeoman Environment Error ");
        console.error(err.message);
    });
}

YoWeb.prototype.getGeneratorNames = function() {
    var generatorNames = this.env.getGeneratorNames();
    var serviceNames = {};
    generatorNames.forEach(function(name){
       serviceNames[name] = generators[name] || name;
    });
    return serviceNames
};


YoWeb.prototype.generateService = function(service, projectName, callback){
    var namespace = service + ':app';
    console.log('Creating new generator - ' + namespace + ' with project name ' + projectName);
    var gen = this.env.create(namespace, {
        'options': {
            'webPrompt': true,
            "skip-install": true
        },
        'arguments': [projectName]
    });

    gen.destinationRoot(path.join(this.env.cwd, 'dist', this.socket.uuid));
    console.log('Running generator');
    gen.run(callback);
};


YoWeb.prototype.registerGeneratorsIn = function(genPath, done) {
    var self = this;
    this.env.findGeneratorsIn([genPath]).forEach(function(dirPath) {
        try {
            var pkg = JSON.parse(fs.readFileSync(path.join(dirPath, 'package.json')));
        } catch (e) {
            console.log("Unable to register generator at ", dirPath);
            console.log("No package.json file found.");
            return;
        }
        pkg.files.forEach(function(file) {
            var pkg = JSON.parse(fs.readFileSync(path.join(dirPath, 'package.json')));
            var name = pkg.name.split('-').pop();
            var genPath = path.join(dirPath, file, 'index.js');
            if(fs.existsSync(genPath)){
                var splitPath = file.split('/');
                self.env.register(path.join(dirPath, file, 'index.js'), name.concat(':', splitPath[splitPath.length - 1]));
            }
        });
        done();
    });
};

module.exports = YoWeb;
