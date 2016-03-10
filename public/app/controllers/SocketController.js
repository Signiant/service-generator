angular.module('serviceGenerator').controller('SocketController', ['$scope', '$state', 'socket', function($scope, $state, socket) {

    eventInit('yo:question', 'yo:answer');
    eventInit('yo:success', null);
    eventInit('service:question', 'service:answer');
    eventInit('git:success', null);
    eventInit('git:error', 'git:answer');
    eventInit('jenkins:error', 'jenkins:answer');
    eventInit(null, 'jenkins:skip');

    socket.on('done', function(service) {
        $state.go('done');
        $scope.service = service;
    });

    function eventInit(inName, outName){
        if(inName){
            socket.on(inName, function(data){
                $scope.$broadcast(inName, data);
            });
        }
        if(outName) {
            $scope.$on(outName, function (event, data) {
                socket.emit(outName, data);
            });
        }
    }

}]);