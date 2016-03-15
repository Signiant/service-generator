angular.module('serviceGenerator').controller('SocketController', ['$scope', '$rootScope', '$state', 'socket', 'QuestionService',  function($scope, $rootScope, $state, socket, QuestionService) {

    questionInit(['service:question', 'yo:question']);
    responseInit(['yo:answer', 'yo:ready', 'service:answer', 'git:answer', 'jenkins:answer', 'jenkins:skip']);
    eventInit(['yo:success', 'git:success', 'git:error', 'jenkins:error']);

    //Reset questions prior to every state change
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
       QuestionService.questions = null;
    });

    socket.on('done', function(service) {
        $state.go('done');
        $scope.service = service;
    });


    function questionInit(eventNames){
        eventNames.forEach(function(eventName){
            socket.on(eventName, function(questions){
                QuestionService.questions = questions;
            })
        }.bind(this));
    }

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