angular.module('serviceGenerator', ['btford.socket-io', 'schemaForm', 'ui.router', 'ngAnimate', 'ngSanitize'])

.factory('socket', function(socketFactory){
        return socketFactory();
})

.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');
    $stateProvider.state(
        /*'home',
        {
            url: '/',
            templateUrl: 'views/partials/partial-home.html'
        }
    ).state(*/
        'select',
        {
            url: '/',
            templateUrl: 'views/partials/partial-select.html',
            controller:  'SelectController'
        }
    ).state(
        'generate',
        {
            templateUrl: 'views/partials/partial-generator.html',
            controller: 'GeneratorController'
        }
    ).state(
        'git',
        {
            templateUrl: 'views/partials/partial-git.html',
            controller: 'GitController'
        }
    ).state(
        'done',
        {
            templateUrl: 'views/partials/partial-done.html',
        }
    ).state(
        'jenkins',
        {
            templateUrl: 'views/partials/partial-jenkins.html',
            controller: 'JenkinsController'
        }
    );

});
