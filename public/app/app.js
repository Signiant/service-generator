angular.module('serviceGenerator', ['btford.socket-io', 'schemaForm', 'ui.router', 'ngAnimate', 'ngSanitize'])

.factory('socket', function(socketFactory){
        return socketFactory();
})

.factory('QuestionService', function(){
        return {questions: null};
})

.factory('GeneratorList', function(){
    return {
        'schema': {
            'service': {
                'type': 'string',
                'title': 'Service',
                'default': null,
                'x-schema-form': {
                    'type': 'select',
                    'titleMap': {}
                }
            },
            'projectName': {
                'type': 'string',
                'title': 'Project Name',
                'required': true,
                'pattern': '^[a-zA-Z0-9-]+$',
                'x-schema-form': {
                    'validationMessage': {202: 'Project name must consist only of letters, numbers, and dashes'}
                }
            }
        }
    };
})

.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');
    $stateProvider.state(
       'home',
        {
            url: '/',
            templateUrl: 'views/partials/partial-home.html'
        }
    ).state(
        'select',
        {
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
