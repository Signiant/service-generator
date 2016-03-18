angular.module('serviceGenerator').controller('SelectController', [ '$scope', '$state', 'QuestionService', 'GeneratorList', function($scope, $state, QuestionService, GeneratorList) {

    var unwatchQuestions = $scope.$watch(function(){ return QuestionService.questions }, function(questions){
        if(questions)
            $scope.$broadcast('form:question', questions);
    });

    var unwatchGenerators = $scope.$watch(function(){ return GeneratorList }, function(generators){
            $scope.$broadcast('form:question', generators);
    });

    $scope.$on('form:answer', function(event, answers){
        answers = JSON.stringify(answers);
        unwatchQuestions();
        unwatchGenerators();
        $state.go('generate');
        $scope.$emit('service:answer', answers);
    });


    $scope.$on('service:question', function(event, questions){
        $scope.$broadcast('form:question', questions);
    });
}]);