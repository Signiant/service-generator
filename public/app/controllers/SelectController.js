angular.module('serviceGenerator').controller('SelectController', [ '$scope', '$state', 'QuestionService', function($scope, $state, QuestionService) {

    $scope.$watch(function(){ return QuestionService.questions }, function(questions){
        if(questions)
            $scope.$broadcast('form:question', questions);
    });

    $scope.$on('form:answer', function(event, answers){
        answers = JSON.stringify(answers);
        $state.go('generate');
        $scope.$emit('service:answer', answers);
    });


    $scope.$on('service:question', function(event, questions){
        $scope.$broadcast('form:question', questions);
    });
}]);