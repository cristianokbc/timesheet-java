(function () {
    "use strict";

    angular.module("angular-search-box-test", ["angular-search-box"]).controller("testController", ["$scope", function ($scope) {
        var disciplines = [
            "Business modelling",
            "Requirements",
            "Analysis and design",
            "Implementation",
            "Test",
            "Deployment",
            "Configuration and change management",
            "Project management",
            "Environment"
        ].map(function (name) {
            return {
                name: name
            };
        });

        $scope.phases = [
            "Inception",
            "Elaboration",
            "Construction",
            "Transition"
        ].map(function (name) {
            return {
                name: name,
                disciplines: disciplines
            };
        });

        $scope.filterPhase = function (phase) {
            if ($scope.filteringPhase && $scope.phaseNamePrefix) {
                return phase.name.toLowerCase().startsWith($scope.phaseNamePrefix.toLowerCase());
            }
            return true;
        };

        $scope.filterDiscipline = function (discipline) {
            if ($scope.filteringDiscipline && $scope.disciplineNamePrefix) {
                return discipline.name.toLowerCase().startsWith($scope.disciplineNamePrefix.toLowerCase());
            }
            return true;
        };
    }]);
})();