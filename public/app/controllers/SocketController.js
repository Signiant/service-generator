angular.module('serviceGenerator').controller('SocketController', ['$scope', '$rootScope', '$state', 'socket', 'QuestionService', 'GeneratorList', function($scope, $rootScope, $state, socket, QuestionService, GeneratorList) {

    responseInit(['yo:answer', 'yo:ready', 'service:answer', 'git:answer', 'jenkins:answer', 'jenkins:skip']);
    eventInit(['yo:success', 'git:success', 'git:error', 'jenkins:error']);

    //Reset questions prior to every state change
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
       QuestionService.questions = null;
    });

    $scope.$on('cancel', function() {
        $scope.restart();
    });

    socket.on('done', function(service) {
        $state.go('done');
        $scope.service = service;
    });

    socket.on('service:list', function(list){
        GeneratorList.schema.service['x-schema-form'].titleMap = list;
        GeneratorList.schema.service.default = Object.keys(list)[0];
    });

    socket.on('yo:question', function(questions){
        QuestionService.questions = questions;
    });

    $scope.restart = function(){
        console.log('Resetting generator');
        socket.disconnect();
        socket.connect();
        $state.go('home');
    };

    function eventInit(eventNames){
        eventNames.forEach(function(eventName){
            socket.on(eventName, function(data){
                $scope.$broadcast(eventName, data);
            });
        }.bind(this));
    }

    function responseInit(eventNames){
        eventNames.forEach(function(eventName){
            $scope.$on(eventName, function (event, data) {
                socket.emit(eventName, data);
            });
        }.bind(this));
    }

}]);
